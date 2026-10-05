import { isDeepStrictEqual } from 'node:util';
import { StrategyExecutor } from './strategy';
import { getStrategy } from './strategies';
import { defaultConfig, type Action, type Config, type Offer, type Snapshot } from './types';

type Schema = 'text' | 'uint' | 'number' | 'boolean' | 'any' | 'nullableUint' | 'nullableText' | Schema[] | { [key: string]: Schema };
const bundle: Schema = { water: 'uint', food: 'uint', components: 'uint' };
const offerBody = { recipient_id: 'text', give: bundle, receive: bundle, expires_tick: 'uint' } satisfies Schema;
const advertisementBody = { selling: { items: ['number'] }, seeking: { items: ['number'] }, expires_tick: 'uint' } satisfies Schema;
const offerSchema: Schema = { ...offerBody, offer_id: 'text', proposer_id: 'text', status: 'number',
  created_tick: 'uint', created_version: 'uint', closed_tick: 'nullableUint', transaction_id: 'nullableText' };
const snapshotSchema: Schema = {
  protocol_version: 'text', run_id: 'text', snapshot_sequence: 'uint', world_version: 'uint', tick: 'uint', phase: 'number', self_station_id: 'text',
  rules: { rules_version: 'text', duration_ticks: 'uint', tick_duration_ms: 'uint', resource_order: { items: ['number'] }, max_health: 'uint',
    shortage_damage_per_unit: 'uint', recovery_per_fully_supplied_tick: 'uint', max_publication_ttl_ticks: 'uint', max_offer_ttl_ticks: 'uint',
    new_commands_per_station_per_tick: 'uint', max_request_records_per_station: 'uint', max_open_outgoing_offers: 'uint', max_command_bytes: 'uint' },
  self: { inventory: bundle, health: 'uint', failed_once: 'boolean', first_failure_tick: 'nullableUint', upkeep_per_tick: bundle, last_production: bundle, specialty: 'number',
    last_unmet_upkeep: bundle, fully_supplied_ticks: 'uint', shortage_ticks: 'uint', current_shortage_streak: 'uint', longest_shortage_streak: 'uint',
    produced_total: bundle, consumed_total: bundle, unmet_total: bundle, imported_total: bundle, exported_total: bundle },
  outcome: 'any',
  offers: { items: [offerSchema] }, advertisements: { items: [{ ...advertisementBody, advertisement_id: 'text', station_id: 'text', status: 'number' }] },
  request_results: { items: [{ protocol_version: 'text', run_id: 'text', request_id: 'text', ok: 'boolean', code: 'number', processed_tick: 'uint', processed_version: 'uint',
    object_id: 'nullableText', transaction_id: 'nullableText', retry_after_tick: 'nullableUint' }] },
  transactions: { items: ['any'] },
};
function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(path + ' must be an object');
  return value as Record<string, unknown>;
}
function read(value: unknown, schema: Schema, path: string, strict = false): unknown {
  const invalid = () => new Error(path + ' is invalid or missing');
  if (Array.isArray(schema)) {
    if (!Array.isArray(value)) throw invalid();
    return value.map((item, i) => read(item, schema[0], `${path}[${i}]`, strict));
  }
  if (typeof schema === 'object') {
    const row = object(value, path);
    if (strict && Object.keys(row).some(key => !Object.hasOwn(schema, key))) throw invalid();
    return Object.fromEntries(Object.entries(schema).map(([key, child]) => [key, read(row[key], child, path + '.' + key, strict)]));
  }
  if (schema === 'any') return value;
  if (schema === 'nullableUint' || schema === 'nullableText') {
    const row = object(value, path);
    const hasValue = Object.hasOwn(row, 'value');
    if (hasValue === (row.null === true)) throw invalid();
    return hasValue ? { value: read(row.value, schema === 'nullableUint' ? 'uint' : 'text', path + '.value') } : { null: true };
  }
  if (schema === 'uint') {
    if (!(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) && !(typeof value === 'string' && /^(0|[1-9][0-9]*)$/.test(value))) throw invalid();
    const integer = BigInt(value as string | number);
    if (integer > 18446744073709551615n) throw invalid();
    return integer;
  }
  if (schema === 'number' && typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return value;
  if (schema === 'text' && typeof value === 'string' && value.length) return value;
  if (schema === 'boolean' && typeof value === 'boolean') return value;
  throw invalid();
}
function action(value: unknown, path: string): Action {
  const row = object(value, path);
  const bodies: Record<string, Schema> = { offer: offerBody, advertise: advertisementBody, accept: { offer_id: 'text' }, withdraw: { object_id: 'text' } };
  if (row.kind === 'wait') return read(value, { kind: 'text' }, path, true) as Action;
  if (typeof row.kind !== 'string' || !Object.hasOwn(bodies, row.kind)) throw new Error(path + '.kind is not a supported action');
  return read(value, { kind: 'text', body: bodies[row.kind] }, path, true) as Action;
}

// Runs the same registered policy and worker-thread boundary as live execution,
// but never constructs an Engine, transport, journal, lock or database client.
export async function checkScenario(value: unknown, override?: string) {
  const scenario = object(value, 'scenario');
  if (Object.keys(scenario).some(key => !['strategy', 'state', 'incomingOffer', 'config', 'expected'].includes(key))) throw new Error('Unknown scenario field');
  const name = override ?? (scenario.strategy === undefined ? undefined : read(scenario.strategy, 'text', 'strategy') as string);
  const strategy = getStrategy(name);
  const snapshot = read(scenario.state, snapshotSchema, 'state') as Snapshot;
  // The directory is optional on the wire; the market policy uses it to find peers.
  const directory = object(scenario.state, 'state').directory;
  if (directory !== undefined) snapshot.directory = read(directory, { items: [{ station_id: 'text', display_name: 'text' }] }, 'state.directory') as Snapshot['directory'];
  if (snapshot.protocol_version !== '2.0') throw new Error('State must use protocol 2.0');
  if (snapshot.rules.duration_ticks - snapshot.tick > 10000n || snapshot.rules.max_offer_ttl_ticks > 10000n) throw new Error('State exceeds supported forecast size');
  if (scenario.incomingOffer !== undefined) {
    const offer = read(scenario.incomingOffer, offerSchema, 'incomingOffer') as Offer;
    if (snapshot.offers.items.some(existing => existing.offer_id === offer.offer_id)) throw new Error('incomingOffer duplicates a state offer ID');
    snapshot.offers.items.push(offer);
  }
  const config: Config = { ...strategy.defaults, version: strategy.version };
  for (const [key, raw] of Object.entries(object(scenario.config ?? {}, 'config'))) {
    if (key === 'version' || !Object.hasOwn(defaultConfig, key)) throw new Error('Unknown config quantity');
    const quantity = read(raw, 'uint', 'config.' + key) as bigint;
    if (quantity < 1n || quantity > 10000n) throw new Error('Config quantities must be between 1 and 10000');
    config[key as Exclude<keyof Config, 'version'>] = quantity;
  }
  const expectedAction = action(object(scenario.expected, 'expected')[strategy.name], 'expected.' + strategy.name);
  const executor = new StrategyExecutor(strategy.name);
  try {
    const { decision, durationMs } = await executor.evaluate({ snapshot, pending: [], memory: { attempted: {} }, config }, 2000, () => {});
    return { strategy: strategy.name, passed: isDeepStrictEqual(decision.action, expectedAction), expectedAction, decision, durationMs };
  } finally { executor.close(); }
}
