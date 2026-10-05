import { active } from './domain';
import { json } from './serialization';
import type { Action, Snapshot } from './types';

// The market is chatty: advertisements come and go several times a tick, and
// each change is a new snapshot. A decision is therefore not stale just
// because a newer snapshot exists, only if the facts it relied on changed.
// Those are our stock, the offers and advertisements we have open (limits and
// debits), the tick (expiry), and the object the action targets. Anything else
// a snapshot changes can make a decision less ideal but not invalid, and the
// server still validates every command.
const ownOpen = (s: Snapshot) => json({
  offers: s.offers.items.filter(o => o.proposer_id === s.self_station_id && active(o.status, o.expires_tick, s.tick)).map(o => o.offer_id).sort(),
  ads: s.advertisements.items.filter(a => a.station_id === s.self_station_id && active(a.status, a.expires_tick, s.tick)).map(a => a.advertisement_id).sort(),
});

export function stillCurrent(action: Action, decided: Snapshot, latest: Snapshot | undefined): boolean {
  if (!latest) return false;
  if (latest === decided) return true;
  if (latest.run_id !== decided.run_id || latest.phase !== 2 || latest.tick !== decided.tick || latest.self.failed_once) return false;
  if (json(latest.self.inventory) !== json(decided.self.inventory) || ownOpen(latest) !== ownOpen(decided)) return false;
  switch (action.kind) {
    case 'accept': {
      const before = decided.offers.items.find(o => o.offer_id === action.body.offer_id);
      const after = latest.offers.items.find(o => o.offer_id === action.body.offer_id);
      return Boolean(before && after && active(after.status, after.expires_tick, latest.tick) && json(before) === json(after));
    }
    case 'withdraw': {
      const id = action.body.object_id;
      return latest.offers.items.some(o => o.offer_id === id && active(o.status, o.expires_tick, latest.tick))
        || latest.advertisements.items.some(a => a.advertisement_id === id && active(a.status, a.expires_tick, latest.tick));
    }
    default: return true;
  }
}
