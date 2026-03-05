import type { PrismaClient } from '@prisma/client';
import { ID } from './ids';

const USERS: Array<{ key: keyof typeof ID.user; email: string }> = [
	{ key: 'alice', email: 'alice@example.com' },
	{ key: 'bob', email: 'bob@example.com' },
	{ key: 'charlie', email: 'charlie@example.com' },
];

/** ユーザーのシードデータを投入する */
export async function seedUsers(prisma: PrismaClient): Promise<void> {
	for (const u of USERS) {
		const userId = ID.user[u.key];
		await prisma.user.upsert({
			where: { id: userId },
			update: { email: u.email },
			create: {
				id: userId,
				email: u.email,
			},
		});
	}
	// biome-ignore lint/suspicious/noConsole: CLI seed script progress output
	console.log(`  Users: ${USERS.length}`);
}
