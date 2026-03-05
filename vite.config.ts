import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig, type UserConfig } from 'vite';
import typedCssModulesPlugin from 'vite-plugin-typed-css-modules';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async ({ command }): Promise<UserConfig> => {
	const qwikCityOptions = (() => {
		if (command === 'serve') {
			return async () => {
				const { getPlatformProxy } = await import('wrangler');
				const platform = await getPlatformProxy<Env>();

				return { platform, routesDir: './src/infrastructure/ui/routes', trailingSlash: false } as const;
			};
		}

		return () => Promise.resolve({ routesDir: './src/infrastructure/ui/routes', trailingSlash: false } as const);
	})();

	return {
		build: {
			rollupOptions: {
				external: [/^@prisma\//],
			},
		},
		plugins: [
			typedCssModulesPlugin(),
			qwikCity(await qwikCityOptions()),
			qwikVite({
				client: {
					input: ['src/infrastructure/ui/root'],
				},
			}),
			tsconfigPaths({ root: '.' }),
		],
		server: {
			host: '0.0.0.0',
		},
	};
});
