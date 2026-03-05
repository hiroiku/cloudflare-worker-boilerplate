import { z } from 'zod';

/** ユーザー登録フォームのバリデーションスキーマ */
export const registerUserSchema = z.object({
	email: z.email(),
});

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
