// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
import { AutoRefresh } from '../app/_components/auto-refresh';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(() => { vi.useRealTimers(); refresh.mockClear(); });

test('refreshes the server page on its interval, skips hidden tabs, and stops when removed', async () => {
  vi.useFakeTimers();
  const container = document.createElement('div');
  const root = createRoot(container);
  await act(async () => root.render(<AutoRefresh intervalMs={1000} />));
  expect(container.textContent).toBe('Live · updates every 1 s');
  act(() => { vi.advanceTimersByTime(2000); });
  expect(refresh).toHaveBeenCalledTimes(2);
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  act(() => { vi.advanceTimersByTime(3000); });
  expect(refresh).toHaveBeenCalledTimes(2);
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  act(() => root.unmount());
  act(() => { vi.advanceTimersByTime(3000); });
  expect(refresh).toHaveBeenCalledTimes(2);
});
