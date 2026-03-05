import { describe, expect, it } from 'vitest';
import type { UserRecord } from '~/application/ports/repositories/user/user.repository';
import { RegisterUserUseCase } from '~/application/use-cases/user/register-user.use-case';
import { createMockUserRepository } from '~mock/application/repositories/user/user.repository.mock';

describe('RegisterUserUseCase', () => {
	const now = new Date('2026-01-01T00:00:00Z');

	function createSavedRecord(overrides?: Partial<UserRecord>): UserRecord {
		return {
			id: 'user_generated_id',
			email: 'test@example.com',
			createdAt: now,
			updatedAt: now,
			...overrides,
		};
	}

	// Repository に正しい引数で save が呼ばれ、結果が Entity に変換されて返ることを検証する
	it('should save user via repository and return serialized entity', async () => {
		const mockRepo = createMockUserRepository();
		const savedRecord = createSavedRecord();
		mockRepo.save = async () => savedRecord;

		const useCase = new RegisterUserUseCase(mockRepo);
		const result = await useCase.execute({
			email: 'test@example.com',
		});

		expect(result.user).toEqual({
			id: 'user_generated_id',
			email: 'test@example.com',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
		});
	});

	// save に渡される入力が execute の input と一致することを検証する
	it('should pass correct input to repository save', async () => {
		const mockRepo = createMockUserRepository();
		const savedRecord = createSavedRecord();
		let capturedInput: unknown;
		mockRepo.save = async input => {
			capturedInput = input;
			return savedRecord;
		};

		const useCase = new RegisterUserUseCase(mockRepo);
		await useCase.execute({
			email: 'alice@example.com',
		});

		expect(capturedInput).toEqual({
			email: 'alice@example.com',
		});
	});
});
