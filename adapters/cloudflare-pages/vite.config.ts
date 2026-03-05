import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig((): UserConfig => {
	return {
		build: {
			rollupOptions: {
				input: ['src/entry.worker.tsx', '@qwik-city-plan'],
			},
			ssr: true,
		},
		css: {
			modules: {
				localsConvention: 'camelCaseOnly',
			},
		},
		plugins: [
			qwikCity({
				routesDir: './src/infrastructure/ui/routes',
				trailingSlash: false,
			}),
			qwikVite(),
			tsconfigPaths({ root: '.' }),
		],
	};
});
