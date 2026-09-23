import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../engine';
import { decodeClient, encodeServer } from '../codec';
import { active, add, affordable, mapBundle, max, min, subtract, total, zero } from '../domain';
import type { AdvertisementBody, OfferBody, Offer, Bundle } from '../types';
import { bundle, snapshot, offer, result } from './fixtures';

for (const scenario of ['cooperative', 'low-stock', 'production-drop'] as const) {
  test(`autonomous binary-protocol simulation: ${scenario}`, async () => {
    const s = snapshot(); s.run_id = `scenario-${scenario}`;
    s.self.inventory = scenario === 'low-stock' ? bundle(4n, 0n, 2n) : bundle(8n, 1n, 8n);
    s.self.health = scenario === 'low-stock' ? 35n : 100n;
    s.advertisements.items = [{ advertisement_id: 'supplier-ad', station_id: 'supplier-z', status: 1, selling: { items: [2,3] }, seeking: { items: [1] }, expires_tick: 6n }];
    let peer = bundle(0n, 100n, 100n), sequence = 0n, id = 0, epoch = 0;
    let accepts = 0, proposals = 0, ads = 0;
    const errors: unknown[] = [], history: { tick: bigint; stock: Bundle; health: bigint }[] = [];
    const send = (msg: unknown) => e.receive(epoch, encodeServer(msg));
    const publish = () => { s.snapshot_sequence = ++sequence; send({ state: structuredClone(s) }); };
    const settle = (o: Offer) => {
      const outgoing = o.proposer_id === s.self_station_id;
      const pay = outgoing ? o.give : o.receive, gain = outgoing ? o.receive : o.give;
      assert.ok(affordable(s.self.inventory, pay)); assert.ok(affordable(peer, gain));
      s.self.inventory = add(subtract(s.self.inventory, pay), gain);
      peer = add(subtract(peer, gain), pay);
      o.status = 2; o.closed_tick = { value: s.tick }; o.transaction_id = { value: `tx-${++id}` };
      s.transactions.items.push({ transaction_id: `tx-${id}`, offer_id: o.offer_id, proposer_id: o.proposer_id, recipient_id: o.recipient_id, give: o.give, receive: o.receive, settled_tick: s.tick, settled_version: ++s.world_version });
    };
    const handle = (bytes: Uint8Array) => {
      try {
        const msg = decodeClient(bytes);
        if (msg.ready) { send({ readiness: { ...msg.ready } }); return; }
        if (msg.sync) { publish(); return; }
        const kind = ['advertise','offer','accept','withdraw'].find(k => msg[k])!;
        assert.ok(kind, 'valid command');
        const command = msg[kind];
        assert.equal(s.phase, 2); assert.equal(s.self.failed_once, false);
        assert.ok(BigInt(s.request_results.items.filter(r => r.processed_tick === s.tick).length) < s.rules.new_commands_per_station_per_tick);
        let objectId = '';
        if (kind === 'advertise') {
          ads++;
          const body = command.body as AdvertisementBody;
          s.advertisements.items = s.advertisements.items.filter(a => a.station_id !== s.self_station_id);
          objectId = `ad-${++id}`;
          s.advertisements.items.push({ ...body, station_id: s.self_station_id, advertisement_id: objectId, status: 1 });
        } else if (kind === 'offer') {
          proposals++;
          const body = command.body as OfferBody;
          assert.ok(affordable(s.self.inventory, body.give));
          assert.ok(total(body.receive) > 0n, 'no outbound gifts');
          assert.equal(body.recipient_id, 'supplier-z');
          assert.ok(body.expires_tick > s.tick && body.expires_tick <= s.rules.duration_ticks);
          assert.equal(s.offers.items.filter(o => o.proposer_id === s.self_station_id && active(o.status, o.expires_tick, s.tick)).length, 0);
          objectId = `offer-${++id}`;
          s.offers.items.push(offer({ ...body, offer_id: objectId, proposer_id: s.self_station_id }));
        } else if (kind === 'accept') {
          accepts++;
          objectId = (command.body as { offer_id: string }).offer_id;
          const o = s.offers.items.find(o => o.offer_id === objectId)!;
          assert.ok(active(o.status, o.expires_tick, s.tick)); settle(o);
        } else {
          objectId = (command.body as { object_id: string }).object_id;
          const o = s.offers.items.find(o => o.offer_id === objectId);
          if (o) o.status = 3;
          s.advertisements.items = s.advertisements.items.filter(a => a.advertisement_id !== objectId);
        }
        const r = result({ run_id: s.run_id, request_id: String(command.request_id), processed_tick: s.tick, processed_version: ++s.world_version, object_id: { value: objectId } });
        s.request_results.items.push(r); send({ result: r }); publish();
        if (kind === 'offer') { settle(s.offers.items.find(o => o.offer_id === objectId)!); publish(); }
      } catch (error) { errors.push(error); e.fail(); }
    };
    const e = new Engine({ sink: { append: async () => {} }, fatal: () => errors.push(new Error('Engine stopped')) });
    epoch = e.connect({ send: bytes => { queueMicrotask(() => handle(bytes)); }, close: () => {} });
    if (scenario === 'low-stock') s.offers.items.push(offer({ give: bundle(0n,2n,2n) }));
    publish();
    for (let tick = 0n; tick <= 6n; tick++) {
      await e.idle();
      assert.deepEqual(errors, []);
      history.push({ tick: s.tick, stock: { ...s.self.inventory }, health: s.self.health });
      if (tick === 6n) break;
      // Cooperative peer supplies any advertised shortfall using actual stock.
      // It asks for water only when the observed offer terms can settle.
      if (s.self.inventory.food < 2n || s.self.inventory.components < 2n) {
        s.offers.items.push(offer({ offer_id: `in-${++id}`, give: bundle(0n, s.self.inventory.food < 2n ? 2n : 0n, s.self.inventory.components < 2n ? 2n : 0n), receive: s.self.inventory.water > 4n ? bundle(1n,0n,0n) : zero(), expires_tick: min(s.tick + 2n, 6n) }));
        s.world_version++; publish(); await e.idle();
      }
      s.tick++;
      for (const o of s.offers.items) if (o.status === 1 && o.expires_tick <= s.tick) o.status = 4;
      s.advertisements.items = s.advertisements.items.filter(a => a.expires_tick > s.tick);
      const production = scenario === 'cooperative' || (scenario === 'production-drop' && s.tick === 1n) ? bundle(3n,0n,0n) : zero();
      s.self.last_production = production;
      const available = add(s.self.inventory, production);
      const unmet = mapBundle(r => max(0n, s.self.upkeep_per_tick[r] - available[r]));
      s.self.inventory = mapBundle(r => max(0n, available[r] - s.self.upkeep_per_tick[r]));
      s.self.health = total(unmet) ? max(0n, s.self.health - total(unmet) * s.rules.shortage_damage_per_unit) : min(s.rules.max_health, s.self.health + s.rules.recovery_per_fully_supplied_tick);
      s.self.failed_once ||= s.self.health === 0n;
      if (s.tick === 6n) s.phase = 4;
      s.world_version++; publish();
    }
    assert.ok(accepts + proposals > 0, 'autonomous trades actually occurred');
    assert.equal(s.self.failed_once, false);
    assert.equal(e.state.snapshot?.phase, 4);
    assert.deepEqual(e.state.snapshot?.self.inventory, s.self.inventory);
    assert.equal(e.state.pending.length, 0);
    if (scenario === 'low-stock') assert.ok(accepts > 0);
    if (scenario !== 'low-stock') assert.ok(proposals > 0);
    console.log(`${scenario}: ${JSON.stringify({ accepts, proposals, ads, health: s.self.health.toString(), final: Object.fromEntries(Object.entries(s.self.inventory).map(([k,v]) => [k,v.toString()])), observations: history.length })}`);
  });
}
