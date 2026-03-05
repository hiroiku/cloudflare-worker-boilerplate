import { describe, expect, it } from 'vitest';
import { UserEntity } from '~/domain/entities/user.entity';

describe('UserEntity', () => {
	const now = new Date('2026-01-01T00:00:00Z');

	function createUserEntity() {
		return new UserEntity({
			id: 'user_01',
			email: 'test@example.com',
			createdAt: now,
			updatedAt: now,
		});
	}

	// constructor でプロパティが正しく設定されることを検証する
	it('should set all properties from constructor input', () => {
		const user = createUserEntity();

		expect(user.id).toBe('user_01');
		expect(user.email).toBe('test@example.com');
		expect(user.createdAt).toBe(now);
		expect(user.updatedAt).toBe(now);
	});

	// serialize() が createdAt/updatedAt を ISO 文字列に変換したプレーンオブジェクトを返すことを検証する
	it('should serialize to a plain object with dates converted to ISO strings', () => {
		const user = createUserEntity();
		const serialized = user.serialize();

		expect(serialized).toEqual({
			id: 'user_01',
			email: 'test@example.com',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
		});
	});

	// serialize() の戻り値がクラスインスタンスではなくプレーンオブジェクトであることを検証する
	it('should return a plain object from serialize, not a class instance', () => {
		const user = createUserEntity();
		const serialized = user.serialize();

		expect(serialized).not.toBeInstanceOf(UserEntity);
	});
});
