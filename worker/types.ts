export const resources = ['water', 'food', 'components'] as const;
export type Resource = typeof resources[number];
export type Bundle = Record<Resource, bigint>;
export type Nullable<T> = { value?: T; null?: boolean };
export interface Rules {
  rules_version: string; duration_ticks: bigint; tick_duration_ms: bigint;
  resource_order: { items: number[] }; max_health: bigint;
  shortage_damage_per_unit: bigint; recovery_per_fully_supplied_tick: bigint;
  max_publication_ttl_ticks: bigint; max_offer_ttl_ticks: bigint;
  new_commands_per_station_per_tick: bigint; max_request_records_per_station: bigint;
  max_open_outgoing_offers: bigint; max_command_bytes: bigint;
}
export interface OfferBody { recipient_id: string; give: Bundle; receive: Bundle; expires_tick: bigint }
export interface Offer extends OfferBody {
  offer_id: string; proposer_id: string; status: number;
  created_tick: bigint; created_version: bigint;
  closed_tick: Nullable<bigint>; transaction_id: Nullable<string>;
}
export interface AdvertisementBody {
  selling: { items: number[] }; seeking: { items: number[] }; expires_tick: bigint;
}
export interface Advertisement extends AdvertisementBody {
  advertisement_id: string; station_id: string; status: number;
}
export interface Transaction {
  transaction_id: string; offer_id: string; proposer_id: string; recipient_id: string;
  give: Bundle; receive: Bundle; settled_tick: bigint; settled_version: bigint;
}
export interface Result {
  protocol_version: string; run_id: string; request_id: string; ok: boolean; code: number;
  processed_tick: bigint; processed_version: bigint;
  object_id: Nullable<string>; transaction_id: Nullable<string>; retry_after_tick: Nullable<bigint>;
}
export interface Snapshot {
  protocol_version: string; run_id: string; snapshot_sequence: bigint; world_version: bigint;
  tick: bigint; phase: number; self_station_id: string; rules: Rules;
  self: { inventory: Bundle; health: bigint; failed_once: boolean; first_failure_tick: Nullable<bigint>;
    upkeep_per_tick: Bundle; last_production: Bundle; specialty: number;
    last_unmet_upkeep: Bundle; fully_supplied_ticks: bigint; shortage_ticks: bigint;
    current_shortage_streak: bigint; longest_shortage_streak: bigint;
    produced_total: Bundle; consumed_total: Bundle; unmet_total: Bundle;
    imported_total: Bundle; exported_total: Bundle };
  outcome: Nullable<{ collective_success: Nullable<boolean>; self_failed: boolean; aborted: boolean }>;
  directory?: { items: { station_id: string; display_name: string }[] };
  offers: { items: Offer[] }; advertisements: { items: Advertisement[] };
  request_results: { items: Result[] }; transactions: { items: Transaction[] };
}
export type Action = { kind: 'wait' } | { kind: 'offer'; body: OfferBody }
  | { kind: 'advertise'; body: AdvertisementBody }
  | { kind: 'accept'; body: { offer_id: string } }
  | { kind: 'withdraw'; body: { object_id: string } };
export type Command = Exclude<Action, { kind: 'wait' }>;
export interface Pending { requestId: string; action: Command; tick: bigint; result?: Result }
export interface Config {
  // Safety: hard stock floor, in ticks of upkeep, that no trade may breach.
  reserveTicks: bigint;
  // Planning: ticks of upkeep to hold, ticks that make a shortage urgent, and
  // extra ticks to stockpile of a resource the market is short of.
  planTicks: bigint; urgentTicks: bigint; stockpileTicks: bigint;
  // Proposals: most units received per offer, offer lifetime, and cooldown.
  lot: bigint; ttl: bigint; cooldownTicks: bigint; maxOpenOffers: bigint;
  // Pricing: opening premium and ladder step, in percent of units received
  // over units given. The floor is always par (never receive fewer units).
  maxPremiumPct: bigint; premiumStepPct: bigint;
  // Unanswered par offers tolerated per station and pair, counted since the
  // last acceptance and within ladderWindowTicks. After that, a needed pair is
  // retried at par once parRetryTicks have passed since the last one expired.
  maxParMisses: bigint; ladderWindowTicks: bigint; parRetryTicks: bigint;
  adTtl: bigint;
  // Commands awaiting an authoritative result at once. Each is fully debited
  // while in flight; identical actions are never sent twice.
  maxInFlight: bigint;
  version: string;
}
export const defaultConfig: Config = {
  reserveTicks: 2n, planTicks: 40n, urgentTicks: 10n, stockpileTicks: 10n,
  lot: 6n, ttl: 3n, cooldownTicks: 1n, maxOpenOffers: 8n,
  maxPremiumPct: 50n, premiumStepPct: 25n, maxParMisses: 2n, ladderWindowTicks: 30n, parRetryTicks: 3n,
  adTtl: 12n, maxInFlight: 3n, version: 'market-5',
};
// Policy memory: cooldowns for attempted terms, plus facts learned from
// command results that no snapshot records. Failed stations were rejected with
// STATION_FAILED (failure is permanent); lag is how many ticks after sending
// the server has recently processed our commands.
export interface Memory { attempted: Record<string, bigint>; failed?: string[]; lag?: bigint }
