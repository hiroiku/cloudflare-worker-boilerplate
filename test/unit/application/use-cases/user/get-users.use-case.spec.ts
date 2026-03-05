import { describe, expect, it } from 'vitest';
import type { UserRecord } from '~/application/ports/repositories/user/user.repository';
import { GetUsersUseCase } from '~/application/use-cases/user/get-users.use-case';
import { createMockUserRepository } from '~mock/application/repositories/user/user.repository.mock';

describe('GetUsersUseCase', () => {
	const now = new Date('2026-01-01T00:00:00Z');

	function createUserRecord(overrides?: Partial<UserRecord>): UserRecord {
		return {
			id: 'user_01',
			email: 'alice@example.com',
			createdAt: now,
			updatedAt: now,
			...overrides,
		};
	}

	// findAll が空配列を返す場合、空の users が返ることを検証する
	it('should return empty users when repository returns empty array', async () => {
		const mockRepo = createMockUserRepository();
		mockRepo.findAll = async () => [];

		const useCase = new GetUsersUseCase(mockRepo);
		const result = await useCase.execute();

		expect(result.users).toEqual([]);
	});

	// 複数ユーザーが正しく Entity に変換されて返ることを検証する
	it('should return users as serialized entities when repository returns records', async () => {
		const mockRepo = createMockUserRepository();
		const records: UserRecord[] = [
			createUserRecord({ id: 'user_01', email: 'alice@example.com' }),
			createUserRecord({ id: 'user_02', email: 'bob@example.com' }),
		];
		mockRepo.findAll = async () => records;

		const useCase = new GetUsersUseCase(mockRepo);
		const result = await useCase.execute();

		expect(result.users).toHaveLength(2);
		expect(result.users[0]).toEqual({
			id: 'user_01',
			email: 'alice@example.com',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
		});
		expect(result.users[1]).toEqual({
			id: 'user_02',
			email: 'bob@example.com',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
		});
	});
});
