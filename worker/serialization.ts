// Preserve wire-sized integers when writing JSON logs, scenarios and commands.
export const json = (value: unknown) => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v);
