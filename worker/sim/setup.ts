import { randomBytes, randomUUID } from 'node:crypto';
import { parseArgs } from 'node:util';
import { balancedStations, defaultEconomy, type EconomyOptions } from './economy';
import { classroomRules, World } from './world';
import type { Faults } from './server';

export interface SimulationOptions {
  economy: EconomyOptions; tickMs: number; host: string; port: number;
  credentials: string; report: string; startAfterMs?: number; faults: Faults;
}

// --fault http-401 | http-503 | subprotocol | garbage | silent-after=TICK
export function parseFault(value: string | undefined): Faults {
  if (value === undefined) return {};
  const http = value.match(/^http-([1-5][0-9][0-9])$/), silent = value.match(/^silent-after=([0-9]+)$/);
  if (http) return { httpStatus: Number(http[1]) };
  if (silent) return { silentAfterTick: BigInt(silent[1]) };
  if (value === 'subprotocol') return { subprotocol: 'bazaar.json.v1' };
  if (value === 'garbage') return { garbage: true };
  throw new Error('--fault must be http-STATUS, subprotocol, garbage or silent-after=TICK');
}

export function simOptions(args: string[]): SimulationOptions {
  const { values } = parseArgs({ args, options: {
    planets: { type: 'string' }, seed: { type: 'string' }, duration: { type: 'string' }, surplus: { type: 'string' },
    block: { type: 'string' }, stock: { type: 'string' }, 'tick-ms': { type: 'string' }, host: { type: 'string' },
    port: { type: 'string' }, credentials: { type: 'string' }, report: { type: 'string' }, 'start-after-ms': { type: 'string' },
    fault: { type: 'string' },
  } });
  const integer = (name: keyof typeof values, fallback: number, least = 1) => {
    const value = values[name];
    if (value === undefined) return fallback;
    if (!/^[0-9]+$/.test(value) || Number(value) < least || Number(value) > 1000000) throw new Error(`--${name} must be an integer from ${least} to 1000000`);
    return Number(value);
  };
  return {
    economy: {
      ...defaultEconomy, planets: integer('planets', defaultEconomy.planets, 3), seed: integer('seed', defaultEconomy.seed, 0),
      durationTicks: BigInt(integer('duration', Number(defaultEconomy.durationTicks))), surplusPct: BigInt(integer('surplus', Number(defaultEconomy.surplusPct), 0)),
      blockTicks: integer('block', defaultEconomy.blockTicks), startingStock: BigInt(integer('stock', Number(defaultEconomy.startingStock), 0)),
    },
    tickMs: integer('tick-ms', 500, 10), host: values.host ?? '127.0.0.1', port: integer('port', 3100, 0),
    credentials: values.credentials ?? '.local/sim/credentials.json', report: values.report ?? '.local/sim/report.json',
    startAfterMs: values['start-after-ms'] === undefined ? undefined : integer('start-after-ms', 0, 0),
    faults: parseFault(values.fault),
  };
}

export function createSimulation(economy: EconomyOptions, tickMs: number) {
  const stations = balancedStations(economy);
  const world = new World({ runId: `sim-${economy.seed}-${randomUUID().slice(0, 8)}`,
    rules: classroomRules({ duration_ticks: economy.durationTicks, tick_duration_ms: BigInt(tickMs) }), stations });
  const players = stations.map(s => ({ station_id: s.id, token: randomBytes(24).toString('hex') }));
  const tokens = Object.fromEntries(players.map(p => [p.token, p.station_id]));
  return { world, players, tokens };
}
