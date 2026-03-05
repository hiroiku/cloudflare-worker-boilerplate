import { config } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

config({ path: '.dev.vars' });

export default defineConfig({
	datasource: {
		url: env('DIRECT_DATABASE_URL'),
	},
	migrations: {
		path: './src/infrastructure/database/prisma/migrations',
		seed: 'bun ./src/infrastructure/database/prisma/seed/index.ts',
	},
	schema: './src/infrastructure/database/prisma',
	typedSql: {
		path: './src/infrastructure/database/prisma/sql',
	},
});
