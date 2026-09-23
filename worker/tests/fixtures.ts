import { defaultConfig, type Snapshot, type Offer, type Result, type Bundle } from '../types';
import { zero } from '../domain';
export { defaultConfig };
export const bundle = (water: bigint, food: bigint, components: bigint): Bundle => ({ water, food, components });
export function snapshot(overrides: Partial<Snapshot> = {}): Snapshot {
  const s = {
    type: 1, protocol_version: '2.0', run_id: 'test-run', snapshot_sequence: 1n, world_version: 1n, tick: 0n, phase: 2, self_station_id: 'ours',
    rules: { rules_version: 'test', duration_ticks: 6n, tick_duration_ms: 100n, resource_order: { items: [1,2,3] }, max_health: 100n, shortage_damage_per_unit: 5n, recovery_per_fully_supplied_tick: 5n, max_publication_ttl_ticks: 6n, max_offer_ttl_ticks: 6n, new_commands_per_station_per_tick: 5n, max_request_records_per_station: 100n, max_open_outgoing_offers: 5n, max_command_bytes: 16384n },
    self: { station_id: 'ours', inventory: bundle(20n, 1n, 8n), health: 100n, failed_once: false, first_failure_tick: { null: true }, upkeep_per_tick: bundle(1n,1n,1n), last_production: zero(), specialty: 1, last_unmet_upkeep: zero(), fully_supplied_ticks: 0n, shortage_ticks: 0n, current_shortage_streak: 0n, longest_shortage_streak: 0n, produced_total: zero(), consumed_total: zero(), unmet_total: zero(), imported_total: zero(), exported_total: zero() },
    directory: { items: [{ station_id: 'ours', display_name: 'Ours' }, { station_id: 'supplier-z', display_name: 'Peer' }] },
    offers: { items: [] }, advertisements: { items: [] }, request_results: { items: [] }, transactions: { items: [] }, outcome: { null: true },
  };
  return { ...s, ...overrides };
}
export function offer(overrides: Partial<Offer> = {}): Offer {
  return { closed_tick: { null: true }, transaction_id: { null: true }, offer_id: 'gift', proposer_id: 'supplier-z', recipient_id: 'ours', give: bundle(0n, 2n, 0n), receive: zero(), expires_tick: 3n, created_tick: 0n, created_version: 1n, status: 1, ...overrides };
}
export function result(overrides: Partial<Result> = {}): Result {
  return { protocol_version: '2.0', run_id: 'test-run', request_id: 'req', ok: true, code: 1, processed_tick: 0n, processed_version: 2n, object_id: { value: 'out' }, transaction_id: { null: true }, retry_after_tick: { null: true }, ...overrides };
}
