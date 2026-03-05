/**
 * テスト用データベースシーダー
 *
 * 冪等な upsert で全モデルを網羅。何度実行しても同じ結果になる。
 */
import { config } from 'dotenv';
import { prisma } from './client';
import { seedUsers } from './user.seed';

config({ path: '.dev.vars' });

async function main(): Promise<void> {
	// biome-ignore lint/suspicious/noConsole: CLI seed script progress output
	console.log('Seeding database...');

	await seedUsers(prisma);

	// biome-ignore lint/suspicious/noConsole: CLI seed script progress output
	console.log('Done.');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		// biome-ignore lint/suspicious/noConsole: CLI seed script error output
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
