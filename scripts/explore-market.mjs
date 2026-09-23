#!/usr/bin/env node

// Exploratory, seedable market model. It deliberately exposes each policy only
// to its own state, public advertisements, and inbound offers. The harness
// retains global state solely to settle trades and score runs.
//
// This is not the classroom server and must not be used to infer hidden live
// rules. Its defaults are hypotheses based on the handbook: three producers
// per resource, variable specialty production, one-unit upkeep, atomic trades,
// exclusive offer expiry, and permanent failure at zero health.
//
// Two comparisons are run:
//   1. Homogeneous rosters - "what happens if everyone plays this strategy".
//   2. A tournament - "how does strategy X do for P01" while the other eight
//      planets stay a fixed, realistic mixed background, across every
//      scenario. This is the more useful question for choosing our own
//      algorithm, since we do not control what classmates run.

const resources = ["water", "food", "components"];
const runs = Number.parseInt(process.argv[2] ?? "200", 10);

// The validator's practice scenario demonstrated a hard cap of 5 stored
// command results before CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED (no result,
// no state change), and the handbook separately says new commands are
// limited per tick. We do not know the live drain rate for stored results,
// and modeling it as a cumulative "leaky bucket" (draining slower than
// typical per-tick demand) saturates permanently and throttles every
// strategy to near zero throughput - a modeling artifact, not a finding. So
// this instead models a per-tick command budget that fully resets each tick:
// an explicit, labeled hypothesis for "commands limited per tick", picked
// higher than the validator's 5 stored-result cap since it is a different,
// less severe constraint. This default (used in Parts 1-4) is itself a
// guess; Part 5 sweeps it directly as a parameter rather than trusting it.
const DEFAULT_CAPACITY_PER_TICK = 2;
// How many ticks an offer/gift stays open before expiring unaccepted.
const DEFAULT_OFFER_TTL = 2;

class Rng {
  constructor(seed) { this.state = seed >>> 0; }
  next() {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }
  int(min, max) { return min + Math.floor(this.next() * (max - min + 1)); }
  pick(items) { return items[this.int(0, items.length - 1)]; }
  shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = this.int(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

const empty = () => Object.fromEntries(resources.map((resource) => [resource, 0]));
const total = (bundle) => resources.reduce((sum, resource) => sum + bundle[resource], 0);
const copyBundle = (bundle) => Object.fromEntries(resources.map((resource) => [resource, bundle[resource]]));
const bundle = (resource, amount) => ({ ...empty(), [resource]: amount });

// Strategy archetypes. `reciprocal` additionally consults per-partner trust
// built from direct experience (see adjustTrust/trustOf) rather than using
// static parameters alone.
const profiles = {
  balanced: { reserve: 3, price: 1, maxOffers: 1, cadence: 1, gifts: false, caution: 0 },
  conservative: { reserve: 5, price: 1, maxOffers: 1, cadence: 1, gifts: false, caution: 2 },
  greedy: { reserve: 3, price: 2, maxOffers: 1, cadence: 1, gifts: false, caution: 0 },
  slow: { reserve: 3, price: 1, maxOffers: 1, cadence: 3, gifts: false, caution: 0 },
  cooperative: { reserve: 3, price: 1, maxOffers: 2, cadence: 1, gifts: true, caution: 0 },
  overextended: { reserve: 2, price: 1, maxOffers: 2, cadence: 1, gifts: false, caution: 0 },
  reciprocal: { reserve: 3, price: 1, maxOffers: 1, cadence: 1, gifts: true, caution: 0, reciprocal: true },
  // Ablation variants: isolate one lever of "cooperative" / "overextended" at
  // a time against the balanced baseline (reserve 3, maxOffers 1, no gifts).
  volumeOnly: { reserve: 3, price: 1, maxOffers: 2, cadence: 1, gifts: false, caution: 0 },
  giftsOnly: { reserve: 3, price: 1, maxOffers: 1, cadence: 1, gifts: true, caution: 0 },
  lowReserveOnly: { reserve: 2, price: 1, maxOffers: 1, cadence: 1, gifts: false, caution: 0 },
  // Volume tiers for the capacity-per-tick sensitivity sweep (Part 5): same
  // shape as balanced/volumeOnly, just more offer attempts per tick.
  volume3: { reserve: 3, price: 1, maxOffers: 3, cadence: 1, gifts: false, caution: 0 },
  volume4: { reserve: 3, price: 1, maxOffers: 4, cadence: 1, gifts: false, caution: 0 },
  // reciprocal, but with cooperative's offer volume instead of balanced's -
  // tests whether trust-based selectivity plus throughput beats either alone.
  reciprocalVolume: { reserve: 3, price: 1, maxOffers: 2, cadence: 1, gifts: true, caution: 0, reciprocal: true },
  // Same shape as cooperative, but gifts are targeted at whichever visible
  // advertiser has the longest persistent public need for our specialty
  // (see world.adStreak) instead of a random/trust pick among seekers.
  triage: { reserve: 3, price: 1, maxOffers: 2, cadence: 1, gifts: true, caution: 0, triage: true },
  // Same shape as "slow" but cadence 2 instead of 3, for the cadence sweep
  // that isolates whether "slow"'s doom is about response cadence itself
  // (rather than offer TTL, which the TTL sweep above rules out).
  slowCadence2: { reserve: 3, price: 1, maxOffers: 1, cadence: 2, gifts: false, caution: 0 },
};

const DEFAULT_SPECIALTY_MAP = resources.flatMap((resource) => [resource, resource, resource]);

const scenarios = [
  { name: "balanced variance", duration: 40, initial: 6, jitter: 1, shocks: [] },
  { name: "food production shock", duration: 40, initial: 6, jitter: 1, shocks: [{ resource: "food", from: 10, until: 18, reduction: 2 }] },
  { name: "uneven starts + component shock", duration: 40, initial: 6, jitter: 1, unevenStarts: true, shocks: [{ resource: "components", from: 8, until: 15, reduction: 2 }] },
  { name: "thin components market (2 of 9 producers)", duration: 40, initial: 6, jitter: 1, shocks: [], specialtyMap: ["water", "water", "water", "water", "food", "food", "food", "components", "components"] },
  { name: "compounding double shock", duration: 40, initial: 6, jitter: 1, shocks: [{ resource: "food", from: 8, until: 16, reduction: 2 }, { resource: "water", from: 12, until: 20, reduction: 2 }] },
];

// Homogeneous rosters: everyone in the class plays the same archetype (plus a
// couple of hand-mixed classes for context).
const homogeneousRosters = [
  { name: "all balanced", members: Array(9).fill("balanced") },
  { name: "all conservative", members: Array(9).fill("conservative") },
  { name: "all greedy", members: Array(9).fill("greedy") },
  { name: "all slow", members: Array(9).fill("slow") },
  { name: "all cooperative", members: Array(9).fill("cooperative") },
  { name: "all overextended", members: Array(9).fill("overextended") },
  { name: "all reciprocal", members: Array(9).fill("reciprocal") },
  { name: "all reciprocalVolume", members: Array(9).fill("reciprocalVolume") },
  { name: "all triage", members: Array(9).fill("triage") },
  { name: "realistic mixed class", members: ["balanced", "balanced", "balanced", "conservative", "conservative", "conservative", "greedy", "greedy", "cooperative"] },
  { name: "overextended cluster", members: ["overextended", "overextended", "overextended", "balanced", "balanced", "balanced", "conservative", "conservative", "cooperative"] },
];

// Fixed background for the tournament: 8 classmates we do not control, held
// constant while only P01's strategy changes. This isolates "which strategy
// is best for us" from "what happens if the whole class agrees".
const tournamentBackground = ["balanced", "balanced", "balanced", "conservative", "conservative", "greedy", "greedy", "slow"];
const tournamentCandidates = ["conservative", "greedy", "cooperative", "balanced", "slow", "overextended", "reciprocal", "reciprocalVolume", "triage"];

// Background sensitivity: we do not control classmates, so re-run the
// tournament against a spread of plausible class compositions instead of the
// single fixed mix above.
const backgroundPresets = [
  { name: "mixed (baseline)", members: tournamentBackground },
  { name: "hostile", members: ["greedy", "greedy", "greedy", "conservative", "conservative", "conservative", "slow", "slow"] },
  { name: "cooperative-leaning", members: ["cooperative", "cooperative", "cooperative", "balanced", "balanced", "balanced", "conservative", "greedy"] },
  { name: "mostly normal, one troublemaker", members: ["balanced", "balanced", "balanced", "balanced", "balanced", "balanced", "balanced", "greedy"] },
];
// A calm and a stressed scenario, used for the (more expensive) background
// sweep and lever-ablation sections instead of the full scenario list.
const calmScenario = scenarios[0];
const stressScenario = scenarios[4];
const ablationCandidates = ["balanced", "lowReserveOnly", "volumeOnly", "giftsOnly", "overextended", "cooperative"];

// Part 5: is "volume wins" robust to the DEFAULT_CAPACITY_PER_TICK guess, and
// where does adding more offers/tick stop paying off?
const volumeTiers = [
  { name: "1 offer/tick", profile: "balanced" },
  { name: "2 offers/tick", profile: "volumeOnly" },
  { name: "3 offers/tick", profile: "volume3" },
  { name: "4 offers/tick", profile: "volume4" },
];
const capacityLevels = [1, 2, 3, 4, 8];

function specialtyFor(index, scenario) {
  const map = scenario.specialtyMap ?? DEFAULT_SPECIALTY_MAP;
  return map[index];
}

function clampTrust(value) { return Math.max(-3, Math.min(5, value)); }
function trustOf(planet, id) { return planet.trust[id] ?? 0; }
function adjustTrust(planet, id, delta) { planet.trust[id] = clampTrust(trustOf(planet, id) + delta); }

function hasCapacity(planet, world) { return planet.commandsThisTick < world.capacityPerTick; }
function consumeCapacity(planet) { planet.commandsThisTick += 1; }

function createPlanet(index, profileName, scenario, rng) {
  const specialty = specialtyFor(index, scenario);
  const inventory = empty();
  for (const resource of resources) {
    inventory[resource] = scenario.unevenStarts ? rng.int(3, 9) : scenario.initial;
  }
  return {
    id: `P${String(index + 1).padStart(2, "0")}`,
    specialty,
    profileName,
    inventory,
    trust: {},
    commandsThisTick: 0,
    capacityBlocked: 0,
    health: 100,
    failed: false,
    minHealth: 100,
    shortages: 0,
    offersCreated: 0,
    offersAccepted: 0,
    giftsAccepted: 0,
    giftsGiven: 0,
  };
}

function desiredResources(planet, profile) {
  return [...resources].sort((left, right) => {
    const leftTarget = profile.reserve + (left === planet.specialty ? 0 : 1);
    const rightTarget = profile.reserve + (right === planet.specialty ? 0 : 1);
    return (planet.inventory[left] - leftTarget) - (planet.inventory[right] - rightTarget);
  });
}

function advertisement(planet, profile) {
  // Only advertise a resource as sought while actually short of it (below
  // reserve+1). Previously this listed both non-specialty resources
  // unconditionally, which made every planet's public "need" identical and
  // permanent - silently defeating any persistence-based targeting (see
  // world.adStreak / triage), since there was never a genuine streak signal
  // to distinguish a currently-needy station from a currently-comfortable one.
  const seeking = desiredResources(planet, profile)
    .filter((resource) => resource !== planet.specialty)
    .filter((resource) => planet.inventory[resource] < profile.reserve + 1)
    .slice(0, 2);
  return { station: planet.id, selling: [planet.specialty], seeking };
}

function canPay(inventory, payment) {
  return resources.every((resource) => inventory[resource] >= payment[resource]);
}

function applyTransfer(inventory, outgoing, incoming) {
  for (const resource of resources) inventory[resource] += incoming[resource] - outgoing[resource];
}

function acceptanceValue(planet, offer, profile) {
  const after = copyBundle(planet.inventory);
  applyTransfer(after, offer.receive, offer.give);
  if (!canPay(planet.inventory, offer.receive)) return -Infinity;
  if (resources.some((resource) => after[resource] < profile.caution)) return -Infinity;

  let value = 0;
  for (const resource of resources) {
    const target = profile.reserve + (resource === planet.specialty ? 0 : 1);
    const need = Math.max(0, target - planet.inventory[resource]);
    const surplus = Math.max(0, planet.inventory[resource] - target);
    value += Math.min(offer.give[resource], need + 1) * 3;
    value += offer.give[resource] * 0.4;
    value -= Math.min(offer.receive[resource], surplus + 1) * 1.5;
    value -= Math.max(0, offer.receive[resource] - surplus - 1) * 3;
  }
  if (profile.reciprocal) value += trustOf(planet, offer.from) * 1.5;
  return value;
}

function decideAcceptances(planet, tick, inbound, world) {
  const profile = profiles[planet.profileName];
  if (tick % profile.cadence !== 0) return;
  for (const offer of inbound) {
    if (offer.status !== "open" || offer.expires <= tick) continue;
    if (acceptanceValue(planet, offer, profile) < 0.5) continue;
    if (!hasCapacity(planet, world)) { planet.capacityBlocked += 1; break; }
    consumeCapacity(planet);
    const proposer = world.planets.find((candidate) => candidate.id === offer.from);
    if (!proposer || proposer.failed || !canPay(proposer.inventory, offer.give) || !canPay(planet.inventory, offer.receive)) {
      offer.status = "failed";
      world.failedSettlements += 1;
      adjustTrust(planet, offer.from, -2);
      continue;
    }
    applyTransfer(proposer.inventory, offer.give, offer.receive);
    applyTransfer(planet.inventory, offer.receive, offer.give);
    offer.status = "accepted";
    world.settlements += 1;
    planet.offersAccepted += 1;
    if (total(offer.receive) === 0) {
      planet.giftsAccepted += 1;
      proposer.giftsGiven += 1;
    }
    adjustTrust(planet, proposer.id, 1);
    adjustTrust(proposer, planet.id, 1);
  }
}

function chooseCounterparty(candidates, planet, profile, rng) {
  if (!profile.reciprocal) return rng.pick(candidates);
  let best = candidates[0];
  let bestTrust = trustOf(planet, best.station);
  for (const candidate of candidates.slice(1)) {
    const t = trustOf(planet, candidate.station);
    if (t > bestTrust) { best = candidate; bestTrust = t; }
  }
  return best;
}

// Gift recipient selection is a distinct decision from picking a trade
// counterparty: "triage" targets the most persistently needy visible
// advertiser (see world.adStreak) rather than trust or chance.
function chooseGiftRecipient(recipients, planet, profile, world, rng) {
  if (!profile.triage) return chooseCounterparty(recipients, planet, profile, rng);
  let best = recipients[0];
  let bestStreak = world.adStreak.get(best.station)?.[planet.specialty] ?? 0;
  for (const candidate of recipients.slice(1)) {
    const streak = world.adStreak.get(candidate.station)?.[planet.specialty] ?? 0;
    if (streak > bestStreak) { best = candidate; bestStreak = streak; }
  }
  return best;
}

function createOffers(planet, tick, publicAds, world, rng) {
  const profile = profiles[planet.profileName];
  if (tick % profile.cadence !== 0 || planet.failed) return;
  const desired = desiredResources(planet, profile).filter((resource) => resource !== planet.specialty);
  const sellable = Math.max(0, planet.inventory[planet.specialty] - profile.reserve);
  if (sellable <= 0) return;

  // Round-robin across desired resources in priority order (most-needed
  // first): one offer per resource per round. This preserves "cover the most
  // urgent need first" for maxOffers 1-2, and for maxOffers 3-4 adds a second
  // round that hedges the same need across an additional supplier rather than
  // being silently capped at one offer per resource type.
  const usedRecipients = new Set();
  let made = 0;
  let progress = true;
  while (made < profile.maxOffers && progress) {
    progress = false;
    for (const need of desired) {
      if (made >= profile.maxOffers) break;
      const suppliers = publicAds.filter((ad) => ad.station !== planet.id && ad.selling.includes(need) && !usedRecipients.has(ad.station));
      if (suppliers.length === 0) continue;
      if (!hasCapacity(planet, world)) { planet.capacityBlocked += 1; made = profile.maxOffers; break; }
      consumeCapacity(planet);
      const supplier = chooseCounterparty(suppliers, planet, profile, rng);
      const amount = profile.price;
      world.offers.push({
        id: `o${world.nextOfferId++}`,
        from: planet.id,
        to: supplier.station,
        give: bundle(planet.specialty, 1),
        receive: bundle(need, amount),
        expires: tick + world.offerTtl,
        status: "open",
      });
      planet.offersCreated += 1;
      made += 1;
      usedRecipients.add(supplier.station);
      progress = true;
    }
  }

  if (profile.gifts && planet.inventory[planet.specialty] >= profile.reserve + 4) {
    const recipients = publicAds.filter((ad) => ad.station !== planet.id && ad.seeking.includes(planet.specialty));
    if (recipients.length > 0 && !hasCapacity(planet, world)) {
      planet.capacityBlocked += 1;
    } else if (recipients.length > 0) {
      consumeCapacity(planet);
      const recipient = chooseGiftRecipient(recipients, planet, profile, world, rng);
      world.offers.push({
        id: `o${world.nextOfferId++}`,
        from: planet.id,
        to: recipient.station,
        give: bundle(planet.specialty, 1),
        receive: empty(),
        expires: tick + world.offerTtl,
        status: "open",
      });
      planet.offersCreated += 1;
    }
  }
}

function productionFor(planet, tick, scenario, rng) {
  let output = 3 + rng.int(-scenario.jitter, scenario.jitter);
  for (const shock of scenario.shocks ?? []) {
    if (shock.resource === planet.specialty && tick >= shock.from && tick < shock.until) {
      output -= shock.reduction;
    }
  }
  return Math.max(0, output);
}

function advanceTick(world, scenario, tick, rng) {
  for (const offer of world.offers) {
    if (offer.status === "open" && offer.expires <= tick) {
      offer.status = "expired";
      world.expiries += 1;
      const fromPlanet = world.planets.find((candidate) => candidate.id === offer.from);
      if (fromPlanet && !fromPlanet.failed) adjustTrust(fromPlanet, offer.to, -1);
    }
  }

  for (const planet of world.planets) {
    planet.commandsThisTick = 0;
  }

  const active = world.planets.filter((planet) => !planet.failed);
  const publicAds = active.map((planet) => advertisement(planet, profiles[planet.profileName]));

  // Track how many consecutive ticks each station has advertised seeking a
  // given resource - a public persistence signal a real client could observe
  // (repeated advertisement), used by the "triage" strategy to target aid.
  for (const ad of publicAds) {
    const previous = world.adStreak.get(ad.station) ?? {};
    const next = {};
    for (const resource of ad.seeking) next[resource] = (previous[resource] ?? 0) + 1;
    world.adStreak.set(ad.station, next);
  }

  for (const planet of rng.shuffle(active)) {
    const inbound = world.offers.filter((offer) => offer.to === planet.id && offer.status === "open");
    decideAcceptances(planet, tick, inbound, world);
    createOffers(planet, tick, publicAds, world, rng);
  }

  for (const planet of world.planets) {
    planet.inventory[planet.specialty] += productionFor(planet, tick, scenario, rng);
    let missing = 0;
    for (const resource of resources) {
      if (planet.inventory[resource] > 0) planet.inventory[resource] -= 1;
      else missing += 1;
    }
    planet.shortages += missing;
    planet.health = Math.max(0, Math.min(100, planet.health + (missing === 0 ? 5 : -5 * missing)));
    planet.minHealth = Math.min(planet.minHealth, planet.health);
    if (planet.health <= 0 && !planet.failed) {
      planet.failed = true;
      for (const offer of world.offers) {
        if (offer.status === "open" && (offer.from === planet.id || offer.to === planet.id)) {
          offer.status = "withdrawn";
          world.failureWithdrawals += 1;
        }
      }
    }
  }
}

function runTrial(scenario, roster, seed, capacityPerTick = DEFAULT_CAPACITY_PER_TICK, offerTtl = DEFAULT_OFFER_TTL) {
  const rng = new Rng(seed);
  const world = {
    planets: roster.members.map((profileName, index) => createPlanet(index, profileName, scenario, rng)),
    offers: [], nextOfferId: 1, settlements: 0, failedSettlements: 0, expiries: 0,
    failureWithdrawals: 0, capacityPerTick, offerTtl, adStreak: new Map(),
  };
  for (let tick = 0; tick < scenario.duration; tick += 1) advanceTick(world, scenario, tick, rng);
  const failed = world.planets.filter((planet) => planet.failed);
  const p01 = world.planets[0];
  return {
    collectiveSurvival: failed.length === 0,
    p01Survival: !p01.failed,
    failed: failed.length,
    minHealth: Math.min(...world.planets.map((planet) => planet.minHealth)),
    settlements: world.settlements,
    failedSettlements: world.failedSettlements,
    expiries: world.expiries,
    failureWithdrawals: world.failureWithdrawals,
    p01FinalResources: total(p01.inventory),
    p01MinHealth: p01.minHealth,
    p01Trades: p01.offersAccepted,
    p01GiftsReceived: p01.giftsAccepted,
    p01GiftsGiven: p01.giftsGiven,
    p01OffersCreated: p01.offersCreated,
    p01CapacityBlocked: p01.capacityBlocked,
    failedProfiles: failed.map((planet) => planet.profileName),
  };
}

function average(values) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
function percent(value) { return `${(value * 100).toFixed(1)}%`; }

function evaluate(scenario, roster, capacityPerTick = DEFAULT_CAPACITY_PER_TICK) {
  const trials = Array.from({ length: runs }, (_, index) => runTrial(scenario, roster, 1_000_003 + index * 97, capacityPerTick));
  return {
    collective: average(trials.map((trial) => Number(trial.collectiveSurvival))),
    p01: average(trials.map((trial) => Number(trial.p01Survival))),
    failed: average(trials.map((trial) => trial.failed)),
    health: average(trials.map((trial) => trial.minHealth)),
    trades: average(trials.map((trial) => trial.settlements)),
    failedTrades: average(trials.map((trial) => trial.failedSettlements)),
    expired: average(trials.map((trial) => trial.expiries)),
    failureWithdrawals: average(trials.map((trial) => trial.failureWithdrawals)),
    p01Resources: average(trials.map((trial) => trial.p01FinalResources)),
    p01MinHealth: average(trials.map((trial) => trial.p01MinHealth)),
    p01Trades: average(trials.map((trial) => trial.p01Trades)),
    p01GiftsReceived: average(trials.map((trial) => trial.p01GiftsReceived)),
    p01GiftsGiven: average(trials.map((trial) => trial.p01GiftsGiven)),
    p01OffersCreated: average(trials.map((trial) => trial.p01OffersCreated)),
    p01CapacityBlocked: average(trials.map((trial) => trial.p01CapacityBlocked)),
  };
}

console.log(`# Exploratory market sweep (${runs} seeded runs per cell)`);
console.log("Model assumptions: 9 planets / 3 producers per resource (unless noted) / 1 upkeep each resource per tick / 5 health per missing unit / variable specialty output around 3 / private inventories.");
console.log(`Command-capacity assumption (Parts 1-4): each planet may issue at most ${DEFAULT_CAPACITY_PER_TICK} accept/offer/gift commands per tick, resetting fully every tick. This is a labeled hypothesis for the handbook's "new commands are limited per tick" (distinct from, and less severe than, the validator-confirmed 5-stored-result cap). A blocked attempt is silently skipped that tick, matching CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED's "no result, no state change". Part 5 sweeps this guessed value directly.`);
console.log("Results rank robustness within this model; they are not forecasts of the live server.");
console.log("Two new strategies appear in Parts 1-3 below: reciprocalVolume (trust-based counterparty selection plus cooperative's offer volume) and triage (cooperative's shape, but gifts target whichever visible advertiser has the longest persistent public need for our specialty, tracked via world.adStreak - a real observable signal, not omniscient knowledge of peer health).");
console.log("");

console.log("## Part 1: homogeneous rosters - what happens if everyone plays this way");
console.log("");
for (const scenario of scenarios) {
  console.log(`### ${scenario.name}`);
  console.log("| market behavior | collective survival | P01 survival | avg failed | avg minimum health | settled | failed settlement | expired | failure withdrawals | P01 final resources |");
  console.log("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const roster of homogeneousRosters) {
    const result = evaluate(scenario, roster);
    console.log(`| ${roster.name} | ${percent(result.collective)} | ${percent(result.p01)} | ${result.failed.toFixed(2)} | ${result.health.toFixed(1)} | ${result.trades.toFixed(1)} | ${result.failedTrades.toFixed(1)} | ${result.expired.toFixed(1)} | ${result.failureWithdrawals.toFixed(1)} | ${result.p01Resources.toFixed(1)} |`);
  }
  console.log("");
}

console.log("## Part 2: tournament - which strategy is best for P01 in a fixed, realistic mixed class");
console.log(`Background (P02-P09, held constant): ${tournamentBackground.join(", ")}`);
console.log("");

const overall = new Map(tournamentCandidates.map((name) => [name, { p01: [], collective: [], health: [], resources: [], trades: [], blocked: [] }]));

for (const scenario of scenarios) {
  console.log(`### ${scenario.name}`);
  console.log("| P01 strategy | P01 survival | class collective survival | P01 min health | P01 final resources | P01 trades settled | P01 gifts given | P01 gifts received | P01 offers made | P01 capacity-blocked attempts |");
  console.log("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
  for (const candidate of tournamentCandidates) {
    const roster = { name: candidate, members: [candidate, ...tournamentBackground] };
    const result = evaluate(scenario, roster);
    console.log(`| ${candidate} | ${percent(result.p01)} | ${percent(result.collective)} | ${result.p01MinHealth.toFixed(1)} | ${result.p01Resources.toFixed(1)} | ${result.p01Trades.toFixed(1)} | ${result.p01GiftsGiven.toFixed(1)} | ${result.p01GiftsReceived.toFixed(1)} | ${result.p01OffersCreated.toFixed(1)} | ${result.p01CapacityBlocked.toFixed(1)} |`);
    const bucket = overall.get(candidate);
    bucket.p01.push(result.p01);
    bucket.collective.push(result.collective);
    bucket.health.push(result.p01MinHealth);
    bucket.resources.push(result.p01Resources);
    bucket.trades.push(result.p01Trades);
    bucket.blocked.push(result.p01CapacityBlocked);
  }
  console.log("");
}

console.log("## Overall ranking across all scenarios (tournament mode, sorted by P01 survival)");
console.log("| P01 strategy | avg P01 survival | avg class collective survival | avg P01 min health | avg P01 final resources | avg P01 trades | avg capacity-blocked attempts |");
console.log("|---|---:|---:|---:|---:|---:|---:|");
const ranked = tournamentCandidates
  .map((name) => ({ name, ...Object.fromEntries(Object.entries(overall.get(name)).map(([key, values]) => [key, average(values)])) }))
  .sort((left, right) => right.p01 - left.p01);
for (const row of ranked) {
  console.log(`| ${row.name} | ${percent(row.p01)} | ${percent(row.collective)} | ${row.health.toFixed(1)} | ${row.resources.toFixed(1)} | ${row.trades.toFixed(1)} | ${row.blocked.toFixed(1)} |`);
}
console.log("");
console.log("Reciprocal tracks per-partner trust from direct experience (successful settlement: +1 both sides; failed settlement: -2 for the party that was let down; an offer left to expire: -1 against the unresponsive recipient) and uses it to prefer reliable counterparties and to lower/raise its own acceptance bar accordingly.");
console.log("");

console.log("## Part 3: background sensitivity - does the ranking hold across different class compositions?");
console.log(`Checked on two representative scenarios: "${calmScenario.name}" (calm) and "${stressScenario.name}" (stressed). Only the background composition changes; P01's candidate strategy is still swapped per row.`);
console.log("");

const backgroundOverall = new Map(tournamentCandidates.map((name) => [name, []]));
for (const scenario of [calmScenario, stressScenario]) {
  for (const preset of backgroundPresets) {
    console.log(`### ${scenario.name} x background: ${preset.name}`);
    console.log(`Background (P02-P09): ${preset.members.join(", ")}`);
    console.log("| P01 strategy | P01 survival | class collective survival | P01 min health |");
    console.log("|---|---:|---:|---:|");
    for (const candidate of tournamentCandidates) {
      const roster = { name: candidate, members: [candidate, ...preset.members] };
      const result = evaluate(scenario, roster);
      console.log(`| ${candidate} | ${percent(result.p01)} | ${percent(result.collective)} | ${result.p01MinHealth.toFixed(1)} |`);
      backgroundOverall.get(candidate).push(result.p01);
    }
    console.log("");
  }
}

console.log("## Overall ranking across all backgrounds x both scenarios (sorted by P01 survival)");
console.log("| P01 strategy | avg P01 survival across all backgrounds |");
console.log("|---|---:|");
const backgroundRanked = tournamentCandidates
  .map((name) => ({ name, p01: average(backgroundOverall.get(name)) }))
  .sort((left, right) => right.p01 - left.p01);
for (const row of backgroundRanked) {
  console.log(`| ${row.name} | ${percent(row.p01)} |`);
}
console.log("");

console.log("## Part 4: lever ablation - what actually drives cooperative/overextended's advantage?");
console.log("Isolates one change from the balanced baseline (reserve 3, maxOffers 1, no gifts) at a time, against the fixed baseline background, on the same calm and stressed scenarios.");
console.log("");
for (const scenario of [calmScenario, stressScenario]) {
  console.log(`### ${scenario.name}`);
  console.log("| P01 strategy | levers vs. balanced | P01 survival | class collective survival | P01 min health | P01 trades settled | P01 gifts given |");
  console.log("|---|---|---:|---:|---:|---:|---:|");
  const labels = {
    balanced: "baseline (reserve 3, 1 offer/tick, no gifts)",
    lowReserveOnly: "reserve 2 only",
    volumeOnly: "2 offers/tick only",
    giftsOnly: "gifts only",
    overextended: "reserve 2 + 2 offers/tick (combined)",
    cooperative: "2 offers/tick + gifts (combined)",
  };
  for (const candidate of ablationCandidates) {
    const roster = { name: candidate, members: [candidate, ...tournamentBackground] };
    const result = evaluate(scenario, roster);
    console.log(`| ${candidate} | ${labels[candidate]} | ${percent(result.p01)} | ${percent(result.collective)} | ${result.p01MinHealth.toFixed(1)} | ${result.p01Trades.toFixed(1)} | ${result.p01GiftsGiven.toFixed(1)} |`);
  }
  console.log("");
}

console.log("## Part 5: is 'volume wins' robust to the capacity-per-tick guess, and where does it stop paying off?");
console.log(`Sweeps the per-tick command budget itself (${capacityLevels.join(", ")}) against P01's offer volume (1-4 offers/tick), holding the fixed baseline background constant. The capacity limit applies to every planet, including the background.`);
console.log("");
for (const scenario of [calmScenario, stressScenario]) {
  const grid = volumeTiers.map((tier) => ({
    tier,
    results: capacityLevels.map((level) => {
      const roster = { name: tier.profile, members: [tier.profile, ...tournamentBackground] };
      return evaluate(scenario, roster, level);
    }),
  }));

  console.log(`### ${scenario.name} - P01 survival`);
  console.log(`| offers/tick | ${capacityLevels.map((level) => `capacity=${level}${level === 8 ? " (~unlimited)" : ""}`).join(" | ")} |`);
  console.log(`|---|${capacityLevels.map(() => "---:").join("|")}|`);
  for (const row of grid) {
    console.log(`| ${row.tier.name} | ${row.results.map((result) => percent(result.p01)).join(" | ")} |`);
  }
  console.log("");

  console.log(`### ${scenario.name} - P01 min health`);
  console.log(`| offers/tick | ${capacityLevels.map((level) => `capacity=${level}${level === 8 ? " (~unlimited)" : ""}`).join(" | ")} |`);
  console.log(`|---|${capacityLevels.map(() => "---:").join("|")}|`);
  for (const row of grid) {
    console.log(`| ${row.tier.name} | ${row.results.map((result) => result.p01MinHealth.toFixed(1)).join(" | ")} |`);
  }
  console.log("");
}

console.log("## Part 6: tipping point - how many well-behaved classmates does collective survival need?");
console.log("Rosters have k 'good' planets (P01 is planets[0], so P01 is 'good' whenever k>=1) and 9-k 'bad' planets cycling through greedy/conservative/slow. Compares two 'good' archetypes: cooperative (high volume, indiscriminate) vs triage (high volume, gifts targeted at whichever visible advertiser has the longest persistent public need).");
console.log("");

function tippingRoster(goodType, k) {
  const badCycle = ["greedy", "conservative", "slow"];
  const members = Array.from({ length: 9 }, (_, index) => (index < k ? goodType : badCycle[index % badCycle.length]));
  return { name: `${goodType} x${k}`, members };
}

const tippingCounts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
for (const scenario of [calmScenario, stressScenario]) {
  console.log(`### ${scenario.name}`);
  console.log("| good classmates (of 9) | cooperative: collective survival | cooperative: P01 (good) survival | triage: collective survival | triage: P01 (good) survival |");
  console.log("|---:|---:|---:|---:|---:|");
  for (const k of tippingCounts) {
    if (k === 0) {
      const result = evaluate(scenario, tippingRoster("cooperative", 0));
      console.log(`| 0 | ${percent(result.collective)} | n/a | ${percent(result.collective)} | n/a |`);
      continue;
    }
    const coopResult = evaluate(scenario, tippingRoster("cooperative", k));
    const triageResult = evaluate(scenario, tippingRoster("triage", k));
    console.log(`| ${k} | ${percent(coopResult.collective)} | ${percent(coopResult.p01)} | ${percent(triageResult.collective)} | ${percent(triageResult.p01)} |`);
  }
  console.log("");
}

console.log("### which single bad archetype is unrescuable, and does targeting (triage) actually beat indiscriminate generosity (cooperative)?");
console.log("8 good-type neighbors (indices 0-7) plus exactly 1 of the named archetype (index 8). Compares 8 triage vs 8 plain-cooperative as the rescuer, isolating whether need-targeted gifting outperforms high-volume-but-random gifting, and which bad archetype - if any - neither can save.");
console.log("");
const loneBadTypes = ["greedy", "conservative", "slow"];
function evaluateLoneBad(scenario, goodType, badType) {
  const roster = { name: `8 ${goodType} + 1 ${badType}`, members: [...Array(8).fill(goodType), badType] };
  const trials = Array.from({ length: runs }, (_, index) => runTrial(scenario, roster, 1_000_003 + index * 97));
  return {
    collective: average(trials.map((trial) => Number(trial.collectiveSurvival))),
    badSurvival: average(trials.map((trial) => Number(!trial.failedProfiles.includes(badType)))),
  };
}
for (const scenario of [calmScenario, stressScenario]) {
  console.log(`#### ${scenario.name}`);
  console.log("| lone bad archetype | 8 cooperative: collective | 8 cooperative: bad planet survival | 8 triage: collective | 8 triage: bad planet survival |");
  console.log("|---|---:|---:|---:|---:|");
  for (const badType of loneBadTypes) {
    const coop = evaluateLoneBad(scenario, "cooperative", badType);
    const triage = evaluateLoneBad(scenario, "triage", badType);
    console.log(`| ${badType} | ${percent(coop.collective)} | ${percent(coop.badSurvival)} | ${percent(triage.collective)} | ${percent(triage.badSurvival)} |`);
  }
  console.log("");
}

console.log("### is 'slow' unrescuable because its cadence (every 3rd tick) outlasts the offer TTL (2 ticks)?");
console.log("Same 8-triage + 1-slow roster, sweeping the offer/gift TTL itself instead of holding it at the Part 1-4 default of 2.");
console.log("");
function evaluateLoneSlowAtTtl(scenario, offerTtl) {
  const roster = { name: "8 triage + 1 slow", members: [...Array(8).fill("triage"), "slow"] };
  const trials = Array.from({ length: runs }, (_, index) => runTrial(scenario, roster, 1_000_003 + index * 97, DEFAULT_CAPACITY_PER_TICK, offerTtl));
  return {
    collective: average(trials.map((trial) => Number(trial.collectiveSurvival))),
    slowSurvival: average(trials.map((trial) => Number(!trial.failedProfiles.includes("slow")))),
  };
}
const ttlLevels = [2, 3, 4, 5, 8];
for (const scenario of [calmScenario, stressScenario]) {
  console.log(`#### ${scenario.name}`);
  console.log(`| offer TTL (ticks) | ${ttlLevels.map((ttl) => `ttl=${ttl}`).join(" | ")} |`);
  console.log(`|---|${ttlLevels.map(() => "---:").join("|")}|`);
  const ttlResults = ttlLevels.map((ttl) => evaluateLoneSlowAtTtl(scenario, ttl));
  console.log(`| class collective survival | ${ttlResults.map((result) => percent(result.collective)).join(" | ")} |`);
  console.log(`| slow planet's own survival | ${ttlResults.map((result) => percent(result.slowSurvival)).join(" | ")} |`);
  console.log("");
}
console.log("TTL alone does not rescue slow (see above) - ruling that hypothesis out. The likely real constraint: with cadence 3 (1 active tick in 3) and a 2-command/tick capacity budget, slow's maximum possible import rate (2 accepts per 3 ticks) is structurally below its 2-units/tick consumption of two non-specialty resources, independent of how long offers stay open. Sweeping cadence itself, holding TTL and capacity at their Part 1-4 defaults, tests that directly:");
console.log("");
function evaluateLoneCadence(scenario, profileName) {
  const roster = { name: `8 triage + 1 ${profileName}`, members: [...Array(8).fill("triage"), profileName] };
  const trials = Array.from({ length: runs }, (_, index) => runTrial(scenario, roster, 1_000_003 + index * 97));
  return {
    collective: average(trials.map((trial) => Number(trial.collectiveSurvival))),
    survival: average(trials.map((trial) => Number(!trial.failedProfiles.includes(profileName)))),
  };
}
const cadenceProfiles = [
  { label: "cadence 1 (balanced)", profile: "balanced" },
  { label: "cadence 2", profile: "slowCadence2" },
  { label: "cadence 3 (slow)", profile: "slow" },
];
for (const scenario of [calmScenario, stressScenario]) {
  console.log(`#### ${scenario.name}`);
  console.log(`| | ${cadenceProfiles.map((entry) => entry.label).join(" | ")} |`);
  console.log(`|---|${cadenceProfiles.map(() => "---:").join("|")}|`);
  const cadenceResults = cadenceProfiles.map((entry) => evaluateLoneCadence(scenario, entry.profile));
  console.log(`| class collective survival | ${cadenceResults.map((result) => percent(result.collective)).join(" | ")} |`);
  console.log(`| that planet's own survival | ${cadenceResults.map((result) => percent(result.survival)).join(" | ")} |`);
  console.log("");
}
