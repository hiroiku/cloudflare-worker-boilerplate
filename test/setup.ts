import { vi } from 'vitest';

// Qwik City の仮想モジュール。Vite ビルド時に自動生成されるため vitest 環境にはモックが必要。
vi.mock('@qwik-city-plan', () => ({
	default: { routes: [], menus: [], trailingSlash: false, basePathname: '/', cacheModules: true },
}));

// Qwik City の Service Worker 登録。Vite ビルド時に自動生成されるため vitest 環境にはモックが必要。
vi.mock('@qwik-city-sw-register', () => ({ default: '' }));
