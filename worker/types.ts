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
export interface Result {
  protocol_version: string; run_id: string; request_id: string; ok: boolean; code: number;
  processed_tick: bigint; processed_version: bigint;
  object_id: Nullable<string>; transaction_id: Nullable<string>; retry_after_tick: Nullable<bigint>;
}
export interface Snapshot {
  protocol_version: string; run_id: string; snapshot_sequence: bigint; world_version: bigint;
  tick: bigint; phase: number; self_station_id: string; rules: Rules;
  self: { inventory: Bundle; health: bigint; failed_once: boolean; first_failure_tick: Nullable<bigint>;
    upkeep_per_tick: Bundle; last_production: Bundle; specialty: number };
  offers: { items: Offer[] }; advertisements: { items: Advertisement[] };
  request_results: { items: Result[] }; transactions: { items: unknown[] };
}
export type Action = { kind: 'wait' } | { kind: 'offer'; body: OfferBody }
  | { kind: 'advertise'; body: AdvertisementBody }
  | { kind: 'accept'; body: { offer_id: string } }
  | { kind: 'withdraw'; body: { object_id: string } };
export type Command = Exclude<Action, { kind: 'wait' }>;
export interface Pending { requestId: string; action: Command; tick: bigint; result?: Result }
export interface Config {
  reserveTicks: bigint; quantity: bigint; giveUnits: bigint; receiveUnits: bigint;
  ttl: bigint; cooldownTicks: bigint; version: string;
}
export const defaultConfig: Config = {
  reserveTicks: 2n, quantity: 1n, giveUnits: 1n, receiveUnits: 1n,
  ttl: 2n, cooldownTicks: 2n, version: 'baseline-1',
};
export interface Memory { attempted: Record<string, bigint> }
