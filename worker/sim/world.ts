// Deterministic local Bazaar rules for simulations and tests. It implements the
// handbook and validator behaviour we depend on; docs/reference/simulator.md
// lists its assumptions and omissions. It is not the classroom server.
import { resources, type Advertisement, type AdvertisementBody, type Bundle, type Offer, type OfferBody, type Result, type Rules, type Snapshot, type Transaction } from '../types';
import { add, affordable, mapBundle, max, min, subtract, total, zero } from '../domain';

export const Code = { OK: 1, REQUEST_ID_CONFLICT: 2, RUN_NOT_RUNNING: 3, RATE_LIMITED: 4, INVALID_ARGUMENT: 5, NOT_FOUND: 6, EXPIRED: 7, NOT_OPEN: 8, LIMIT_REACHED: 9, INSUFFICIENT_RESOURCES: 10, STATION_FAILED: 11 } as const;
export const Control = { BAD_MESSAGE: 1, REQUEST_CAPACITY_EXCEEDED: 2, UNSUPPORTED_VERSION: 3, RUN_MISMATCH: 4, SESSION_FENCED: 6 } as const;
export const Phase = { READY: 1, RUNNING: 2, FINISHED: 4 } as const;
const OfferStatus = { OPEN: 1, ACCEPTED: 2, WITHDRAWN: 3, EXPIRED: 4 } as const;
const AdStatus = { ACTIVE: 1, REPLACED: 2, WITHDRAWN: 3, EXPIRED: 4 } as const;

export interface StationSetup {
  id: string; name?: string; specialty: number; inventory: Bundle; upkeep: Bundle;
  // Specialty units credited on ticks 1, 2, ...; missing entries produce nothing.
  production: bigint[]; health?: bigint;
}
export interface WorldSetup { runId: string; rules: Rules; stations: StationSetup[] }
export type CommandKind = 'advertise' | 'offer' | 'accept' | 'withdraw';
export type CommandOutcome = { result: Result; affected: string[] | 'all' } | { control: number };
type Station = Snapshot['self'] & { station_id: string; display_name: string; production: bigint[]; health_lost: bigint };
type Ad = Advertisement & { created_tick: bigint; created_version: bigint };
type Effect = { code: number; object?: string; transaction?: string; affected?: string[] | 'all' };

export function classroomRules(overrides: Partial<Rules> = {}): Rules {
  return {
    rules_version: 'local-sim-1', duration_ticks: 120n, tick_duration_ms: 500n, resource_order: { items: [1, 2, 3] },
    max_health: 100n, shortage_damage_per_unit: 5n, recovery_per_fully_supplied_tick: 5n,
    max_publication_ttl_ticks: 12n, max_offer_ttl_ticks: 12n, new_commands_per_station_per_tick: 10n,
    max_request_records_per_station: 2048n, max_open_outgoing_offers: 24n, max_command_bytes: 16384n, ...overrides,
  };
}

export class World {
  readonly runId: string;
  readonly rules: Rules;
  tick = 0n;
  phase: number = Phase.READY;
  worldVersion = 1n;
  private readonly stations = new Map<string, Station>();
  private readonly offers = new Map<string, Offer>();
  private readonly ads: Ad[] = [];
  private readonly transactions: Transaction[] = [];
  private readonly records = new Map<string, Map<string, { result: Result; fingerprint: string }>>();
  private readonly used = new Map<string, bigint>();
  private ids = 0;

  constructor(setup: WorldSetup) {
    this.runId = setup.runId; this.rules = setup.rules;
    for (const s of setup.stations) {
      this.stations.set(s.id, {
        station_id: s.id, display_name: s.name ?? s.id, production: s.production, health_lost: 0n, specialty: s.specialty,
        inventory: { ...s.inventory }, upkeep_per_tick: { ...s.upkeep }, health: s.health ?? setup.rules.max_health,
        failed_once: false, first_failure_tick: { null: true }, last_production: zero(), last_unmet_upkeep: zero(),
        fully_supplied_ticks: 0n, shortage_ticks: 0n, current_shortage_streak: 0n, longest_shortage_streak: 0n,
        produced_total: zero(), consumed_total: zero(), unmet_total: zero(), imported_total: zero(), exported_total: zero(),
      });
      this.records.set(s.id, new Map());
    }
  }

  get stationIds() { return [...this.stations.keys()]; }
  get finished() { return this.phase === Phase.FINISHED; }

  start() {
    if (this.phase !== Phase.READY) return;
    this.phase = Phase.RUNNING; this.worldVersion++;
  }

  // A new request ID always stores a result, including rejections, and counts
  // toward the per-tick quota. Exact retries and ID conflicts store nothing.
  command(stationId: string, kind: CommandKind, requestId: string, body: unknown, fingerprint: string): CommandOutcome {
    const station = this.stations.get(stationId)!, records = this.records.get(stationId)!;
    const stored = records.get(requestId);
    if (stored) {
      if (stored.fingerprint === fingerprint) return { result: stored.result, affected: [stationId] };
      return { result: this.result(requestId, { code: Code.REQUEST_ID_CONFLICT }), affected: [stationId] };
    }
    if (BigInt(records.size) >= this.rules.max_request_records_per_station) return { control: Control.REQUEST_CAPACITY_EXCEEDED };
    this.worldVersion++;
    const used = this.used.get(stationId) ?? 0n;
    this.used.set(stationId, used + 1n);
    const effect: Effect = this.phase !== Phase.RUNNING ? { code: Code.RUN_NOT_RUNNING }
      : used >= this.rules.new_commands_per_station_per_tick ? { code: Code.RATE_LIMITED }
      : station.failed_once ? { code: Code.STATION_FAILED }
      : kind === 'advertise' ? this.advertise(station, body as AdvertisementBody)
      : kind === 'offer' ? this.offer(station, body as OfferBody)
      : kind === 'accept' ? this.accept(station, (body as { offer_id: string }).offer_id)
      : this.withdraw(station, (body as { object_id: string }).object_id);
    const result = this.result(requestId, effect);
    records.set(requestId, { result, fingerprint });
    return { result, affected: effect.affected ?? [stationId] };
  }

  private result(requestId: string, effect: Effect): Result & { type: number } {
    return {
      type: 1, protocol_version: '2.0', run_id: this.runId, request_id: requestId, ok: effect.code === Code.OK, code: effect.code,
      processed_tick: this.tick, processed_version: this.worldVersion,
      object_id: effect.object ? { value: effect.object } : { null: true },
      transaction_id: effect.transaction ? { value: effect.transaction } : { null: true },
      retry_after_tick: effect.code === Code.RATE_LIMITED ? { value: this.tick + 1n } : { null: true },
    };
  }

  private expiryValid(expires: bigint, ttl: bigint) {
    return expires > this.tick && expires <= this.tick + ttl && expires <= this.rules.duration_ticks;
  }

  private advertise(station: Station, body: AdvertisementBody): Effect {
    const valid = (items: number[]) => items.every(r => r >= 1 && r <= resources.length) && new Set(items).size === items.length;
    if (!valid(body.selling.items) || !valid(body.seeking.items) || !this.expiryValid(body.expires_tick, this.rules.max_publication_ttl_ticks)) return { code: Code.INVALID_ARGUMENT };
    for (const ad of this.ads) if (ad.station_id === station.station_id && ad.status === AdStatus.ACTIVE) ad.status = AdStatus.REPLACED;
    const id = `ad-${++this.ids}`;
    this.ads.push({ advertisement_id: id, station_id: station.station_id, selling: { items: [...body.selling.items] }, seeking: { items: [...body.seeking.items] },
      expires_tick: body.expires_tick, status: AdStatus.ACTIVE, created_tick: this.tick, created_version: this.worldVersion });
    return { code: Code.OK, object: id, affected: 'all' };
  }

  private offer(station: Station, body: OfferBody): Effect {
    const recipient = this.stations.get(body.recipient_id);
    if (!recipient) return { code: Code.NOT_FOUND };
    if (recipient === station || total(body.give) === 0n || resources.some(r => body.give[r] > 0n && body.receive[r] > 0n)
      || !this.expiryValid(body.expires_tick, this.rules.max_offer_ttl_ticks)) return { code: Code.INVALID_ARGUMENT };
    if (recipient.failed_once) return { code: Code.STATION_FAILED };
    const open = [...this.offers.values()].filter(o => o.proposer_id === station.station_id && o.status === OfferStatus.OPEN).length;
    if (BigInt(open) >= this.rules.max_open_outgoing_offers) return { code: Code.LIMIT_REACHED };
    if (!affordable(station.inventory, body.give)) return { code: Code.INSUFFICIENT_RESOURCES };
    const id = `offer-${++this.ids}`;
    this.offers.set(id, { offer_id: id, proposer_id: station.station_id, recipient_id: recipient.station_id, give: { ...body.give }, receive: { ...body.receive },
      expires_tick: body.expires_tick, created_tick: this.tick, created_version: this.worldVersion, status: OfferStatus.OPEN,
      closed_tick: { null: true }, transaction_id: { null: true } });
    return { code: Code.OK, object: id, affected: [station.station_id, recipient.station_id] };
  }

  // An open offer is never past its deadline (each tick expires first), and a
  // failed station's offers are withdrawn. As on the live server (run-42), an
  // expired offer answers EXPIRED; any other closed offer answers NOT_OPEN.
  private accept(station: Station, offerId: string): Effect {
    const offer = this.offers.get(offerId);
    if (!offer || (offer.recipient_id !== station.station_id && offer.proposer_id !== station.station_id)) return { code: Code.NOT_FOUND };
    if (offer.recipient_id !== station.station_id) return { code: Code.INVALID_ARGUMENT };
    if (offer.status === OfferStatus.EXPIRED) return { code: Code.EXPIRED };
    if (offer.status !== OfferStatus.OPEN) return { code: Code.NOT_OPEN };
    const proposer = this.stations.get(offer.proposer_id)!;
    if (!affordable(proposer.inventory, offer.give) || !affordable(station.inventory, offer.receive)) return { code: Code.INSUFFICIENT_RESOURCES };
    proposer.inventory = add(subtract(proposer.inventory, offer.give), offer.receive);
    station.inventory = add(subtract(station.inventory, offer.receive), offer.give);
    proposer.exported_total = add(proposer.exported_total, offer.give); proposer.imported_total = add(proposer.imported_total, offer.receive);
    station.exported_total = add(station.exported_total, offer.receive); station.imported_total = add(station.imported_total, offer.give);
    const id = `tx-${++this.ids}`;
    this.close(offer, OfferStatus.ACCEPTED);
    offer.transaction_id = { value: id };
    this.transactions.push({ transaction_id: id, offer_id: offer.offer_id, proposer_id: offer.proposer_id, recipient_id: offer.recipient_id,
      give: { ...offer.give }, receive: { ...offer.receive }, settled_tick: this.tick, settled_version: this.worldVersion });
    return { code: Code.OK, object: offer.offer_id, transaction: id, affected: [proposer.station_id, station.station_id] };
  }

  private withdraw(station: Station, objectId: string): Effect {
    const offer = this.offers.get(objectId);
    if (offer?.proposer_id === station.station_id) {
      if (offer.status !== OfferStatus.OPEN) return { code: Code.NOT_OPEN };
      this.close(offer, OfferStatus.WITHDRAWN);
      return { code: Code.OK, object: objectId, affected: [station.station_id, offer.recipient_id] };
    }
    const ad = this.ads.find(a => a.advertisement_id === objectId && a.station_id === station.station_id);
    if (!ad) return { code: Code.NOT_FOUND };
    if (ad.status !== AdStatus.ACTIVE) return { code: Code.NOT_OPEN };
    ad.status = AdStatus.WITHDRAWN;
    return { code: Code.OK, object: objectId, affected: 'all' };
  }

  private close(offer: Offer, status: number) { offer.status = status; offer.closed_tick = { value: this.tick }; }

  // Handbook order: expire, produce, consume upkeep, then damage or recover.
  advance() {
    if (this.phase !== Phase.RUNNING) return;
    this.tick++; this.worldVersion++; this.used.clear();
    for (const offer of this.offers.values()) if (offer.status === OfferStatus.OPEN && offer.expires_tick <= this.tick) this.close(offer, OfferStatus.EXPIRED);
    for (const ad of this.ads) if (ad.status === AdStatus.ACTIVE && ad.expires_tick <= this.tick) ad.status = AdStatus.EXPIRED;
    for (const s of this.stations.values()) {
      const produced = zero();
      produced[resources[s.specialty - 1]] = s.production[Number(this.tick) - 1] ?? 0n;
      const available = add(s.inventory, produced);
      const consumed = mapBundle(r => min(available[r], s.upkeep_per_tick[r]));
      const unmet = subtract(s.upkeep_per_tick, consumed);
      s.inventory = subtract(available, consumed);
      s.last_production = produced; s.last_unmet_upkeep = unmet;
      s.produced_total = add(s.produced_total, produced); s.consumed_total = add(s.consumed_total, consumed); s.unmet_total = add(s.unmet_total, unmet);
      if (total(unmet) > 0n) {
        const health = max(0n, s.health - total(unmet) * this.rules.shortage_damage_per_unit);
        s.health_lost += s.health - health; s.health = health;
        s.shortage_ticks++; s.current_shortage_streak++;
        s.longest_shortage_streak = max(s.longest_shortage_streak, s.current_shortage_streak);
      } else {
        s.health = min(this.rules.max_health, s.health + this.rules.recovery_per_fully_supplied_tick);
        s.fully_supplied_ticks++; s.current_shortage_streak = 0n;
      }
      if (s.health === 0n && !s.failed_once) this.fail(s);
    }
    // Offers and advertisements may not outlive the run, so all of them have
    // expired by the final tick and none is ever marked RUN_ENDED.
    if (this.tick >= this.rules.duration_ticks) this.phase = Phase.FINISHED;
  }

  // Zero health is permanent: trading stops and every open offer or active
  // advertisement involving the station is withdrawn. Production continues.
  private fail(s: Station) {
    s.failed_once = true; s.first_failure_tick = { value: this.tick };
    for (const offer of this.offers.values()) {
      if (offer.status === OfferStatus.OPEN && (offer.proposer_id === s.station_id || offer.recipient_id === s.station_id)) this.close(offer, OfferStatus.WITHDRAWN);
    }
    for (const ad of this.ads) if (ad.station_id === s.station_id && ad.status === AdStatus.ACTIVE) ad.status = AdStatus.WITHDRAWN;
  }

  // Only what the handbook says a station may see: its own observation and
  // private offers/transactions, plus public advertisements and the directory.
  view(stationId: string, sequence: bigint): Snapshot & { type: number } {
    const station = this.stations.get(stationId)!;
    const involves = (o: { proposer_id: string; recipient_id: string }) => o.proposer_id === stationId || o.recipient_id === stationId;
    const { production: _production, display_name: _name, health_lost: _lost, ...self } = station;
    const collective = [...this.stations.values()].every(s => !s.failed_once);
    return structuredClone({
      type: 1, protocol_version: '2.0', run_id: this.runId, snapshot_sequence: sequence, world_version: this.worldVersion,
      tick: this.tick, phase: this.phase, self_station_id: stationId, rules: this.rules,
      directory: { items: [...this.stations.values()].map(s => ({ station_id: s.station_id, display_name: s.display_name })) },
      self,
      offers: { items: [...this.offers.values()].filter(involves) },
      advertisements: { items: this.ads.filter(a => a.status === AdStatus.ACTIVE) },
      transactions: { items: this.transactions.filter(involves) },
      request_results: { items: [...this.records.get(stationId)!.values()].map(r => r.result) },
      outcome: this.finished ? { value: { collective_success: { value: collective }, self_failed: station.failed_once, aborted: false } } : { null: true },
    });
  }

  // Server-side facts for scoring; clients never receive this.
  report() {
    const stations = [...this.stations.values()].map(s => ({
      station_id: s.station_id, specialty: resources[s.specialty - 1], survived: !s.failed_once,
      first_failure_tick: s.first_failure_tick.value, final_health: s.health, final_inventory: { ...s.inventory },
      final_resources: total(s.inventory), unmet_total: { ...s.unmet_total }, shortage_ticks: s.shortage_ticks,
      health_lost: s.health_lost,
      produced_total: { ...s.produced_total }, imported_total: { ...s.imported_total }, exported_total: { ...s.exported_total },
      transactions: this.transactions.filter(t => t.proposer_id === s.station_id || t.recipient_id === s.station_id).length,
    }));
    return { run_id: this.runId, tick: this.tick, phase: this.phase, collective_success: stations.every(s => s.survived),
      transactions: this.transactions.length, stations };
  }
}
