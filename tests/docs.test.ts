import { expect, test } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
function markdown(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? markdown(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : []);
}
test('maintained documentation has valid local file links and every guide is indexed', () => {
  const pages = markdown('docs');
  for (const file of ['README.md', ...pages]) {
    const body = readFileSync(file, 'utf8');
    for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      expect(existsSync(resolve(dirname(file), target)), `${file}: ${target}`).toBe(true);
    }
  }
  const index = readFileSync('docs/README.md', 'utf8');
  for (const page of pages.filter(p => p !== 'docs/README.md')) expect(index, page).toContain(`(${page.slice(5)})`);
});
