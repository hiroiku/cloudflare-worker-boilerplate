import { z } from 'zod';

/** ユーザー削除フォームのバリデーションスキーマ */
export const deleteUserSchema = z.object({
	id: z.string().min(1),
});

export type DeleteUserFormData = z.infer<typeof deleteUserSchema>;
