import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createContainer } from 'katagami';
import type { UserRepository } from '~/application/ports/repositories/user/user.repository';
import { PrismaUserRepository } from '~/infrastructure/repositories/user/user.repository';

/** Infrastructure 層のトークン型マップ */
export interface InfrastructureService {
	UserRepository: UserRepository;
}

/** DATABASE_URL のプロトコルに応じた PrismaClient を生成し、URL ごとに isolate 内でキャッシュする */
const createPrismaClient: (databaseUrl: string) => PrismaClient = (() => {
	const cache = new Map<string, PrismaClient>();

	return (databaseUrl: string): PrismaClient => {
		const cached = cache.get(databaseUrl);
		if (cached !== undefined) {
			return cached;
		}

		let client: PrismaClient;
		if (databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')) {
			// $extends() の戻り値型は PrismaClient と構造非互換だが、
			// 拡張クライアントは PrismaClient の完全なスーパーセットのため明示的にキャストする
			client = new PrismaClient({ datasourceUrl: databaseUrl }).$extends(withAccelerate()) as unknown as PrismaClient;
		} else {
			client = new PrismaClient({ datasourceUrl: databaseUrl });
		}

		cache.set(databaseUrl, client);
		return client;
	};
})();

/** Infrastructure 層のサービスを登録したコンテナを構築する */
export function buildInfrastructureContainer(env: Env) {
	const prismaClient = createPrismaClient(env.DATABASE_URL);

	return createContainer<InfrastructureService>().registerSingleton(
		'UserRepository',
		() => new PrismaUserRepository(prismaClient),
	);
}
