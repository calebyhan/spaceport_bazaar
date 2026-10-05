import { expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.mock('next/navigation', () => ({ redirect: vi.fn(() => { throw new Error('REDIRECT'); }) }));
import { redirect } from 'next/navigation';
import HomePage from '../app/page';
import RootLayout, { metadata } from '../app/layout';
import { GET } from '../app/api/health/route';

test('home opens the local live view without a database', () => {
  expect(HomePage).toThrow('REDIRECT'); expect(redirect).toHaveBeenCalledWith('/live');
});
test('health reports local persistence without database configuration', async () => {
  expect(GET().status).toBe(200);
  expect(await GET().json()).toEqual({ service: 'spaceport-bazaar-dashboard', persistence: 'local-journal' });
});
test('layout preserves content and only offers local views', () => {
  const page = renderToStaticMarkup(<RootLayout><p>Content</p></RootLayout>);
  expect(page).toContain('Content'); expect(page).toContain('lang="en"');
  for (const href of ['/live', '/runs']) expect(page).toContain(`href="${href}"`);
  expect(page).not.toContain('Database'); expect(metadata.title).toBe('Spaceport Bazaar');
});
