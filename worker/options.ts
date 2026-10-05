import { parseArgs } from 'node:util';
import { getStrategy } from './strategies';

export function workerOptions(args: string[], environment: Readonly<Record<string, string | undefined>>, selectedStrategy?: string) {
  const { values } = parseArgs({ args, options: {
    strategy: { type: 'string' }, exercise: { type: 'boolean' },
    'list-strategies': { type: 'boolean' },
  } });
  if (values.exercise && (values.strategy !== undefined || environment.BAZAAR_STRATEGY !== undefined)) {
    throw new Error('--exercise cannot be combined with --strategy or BAZAAR_STRATEGY');
  }
  return { exercise: values.exercise === true,
    list: values['list-strategies'] === true, strategy: getStrategy(values.strategy ?? (values.exercise ? undefined : selectedStrategy) ?? environment.BAZAAR_STRATEGY) };
}
