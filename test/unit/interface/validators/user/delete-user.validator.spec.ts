import { describe, expect, it } from 'vitest';
import { deleteUserSchema } from '~/interface/validators/user/delete-user.validator';

describe('deleteUserSchema', () => {
	// 有効な ID を受け付けることを検証する
	it('should accept a valid id', () => {
		const result = deleteUserSchema.safeParse({ id: 'user_01' });

		expect(result.success).toBe(true);
	});

	// 空文字の ID を拒否することを検証する
	it('should reject an empty id', () => {
		const result = deleteUserSchema.safeParse({ id: '' });

		expect(result.success).toBe(false);
	});

	// id フィールドが存在しない場合を拒否することを検証する
	it('should reject when id field is missing', () => {
		const result = deleteUserSchema.safeParse({});

		expect(result.success).toBe(false);
	});
});
