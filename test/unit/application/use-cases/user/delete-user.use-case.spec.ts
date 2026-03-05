import { describe, expect, it } from 'vitest';
import type { UserRecord } from '~/application/ports/repositories/user/user.repository';
import { DeleteUserUseCase } from '~/application/use-cases/user/delete-user.use-case';
import { UserNotFoundError } from '~/domain/errors/user-not-found.error';
import { createMockUserRepository } from '~mock/application/repositories/user/user.repository.mock';

describe('DeleteUserUseCase', () => {
	const now = new Date('2026-01-01T00:00:00Z');

	function createUserRecord(overrides?: Partial<UserRecord>): UserRecord {
		return {
			id: 'user_01',
			email: 'test@example.com',
			createdAt: now,
			updatedAt: now,
			...overrides,
		};
	}

	// ユーザーが存在する場合、deleteById が正しい ID で呼ばれ空のオブジェクトを返すことを検証する
	it('should call deleteById with the given id and return empty object', async () => {
		const mockRepo = createMockUserRepository();
		const record = createUserRecord();
		let capturedId: unknown;

		mockRepo.findById = async () => record;
		mockRepo.deleteById = async id => {
			capturedId = id;
		};

		const useCase = new DeleteUserUseCase(mockRepo);
		const result = await useCase.execute({ id: 'user_01' });

		expect(capturedId).toBe('user_01');
		expect(result).toEqual({});
	});

	// ユーザーが存在しない場合、UserNotFoundError がスローされることを検証する
	it('should throw UserNotFoundError when user does not exist', async () => {
		const mockRepo = createMockUserRepository();
		mockRepo.findById = async () => null;

		const useCase = new DeleteUserUseCase(mockRepo);

		await expect(useCase.execute({ id: 'nonexistent_id' })).rejects.toThrow(UserNotFoundError);
	});
});
