import { describe, expect, it } from 'vitest';
import { registerUserSchema } from '~/interface/validators/user/register-user.validator';

describe('registerUserSchema', () => {
	// 有効なメールアドレスを受け付けることを検証する
	it('should accept a valid email', () => {
		const result = registerUserSchema.safeParse({ email: 'test@example.com' });

		expect(result.success).toBe(true);
	});

	// 無効なメールアドレス形式 (@ なし) を拒否することを検証する
	it('should reject an invalid email format', () => {
		const result = registerUserSchema.safeParse({ email: 'not-an-email' });

		expect(result.success).toBe(false);
	});

	// 空文字のメールアドレスを拒否することを検証する
	it('should reject an empty email', () => {
		const result = registerUserSchema.safeParse({ email: '' });

		expect(result.success).toBe(false);
	});

	// email フィールドが存在しない場合を拒否することを検証する
	it('should reject when email field is missing', () => {
		const result = registerUserSchema.safeParse({});

		expect(result.success).toBe(false);
	});
});
