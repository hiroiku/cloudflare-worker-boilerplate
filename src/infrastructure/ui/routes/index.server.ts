import type { JSONObject, RequestEventAction, RequestEventLoader } from '@builder.io/qwik-city';
import { useContainer } from '~/container';
import type { ISerializedUserEntity } from '~/domain/entities/user.entity';
import { deleteUserSchema } from '~/interface/validators/user/delete-user.validator';
import { registerUserSchema } from '~/interface/validators/user/register-user.validator';

/** ユーザー登録のサーバーハンドラー */
export async function registerUserHandler(
	form: JSONObject,
	requestEvent: RequestEventAction,
): Promise<{ user: ISerializedUserEntity } | undefined> {
	const parsed = registerUserSchema.safeParse(form);

	if (!parsed.success) {
		requestEvent.fail(400, { message: '入力が不正です' });
		return;
	}

	const container = await useContainer(requestEvent.platform.env);
	const useCase = container.resolve('RegisterUserUseCase');
	const result = await useCase.execute({ email: parsed.data.email });

	return { user: result.user };
}

/** ユーザー一覧取得のサーバーハンドラー (routeLoader 用) */
export async function getUsersHandler(requestEvent: RequestEventLoader): Promise<{ users: ISerializedUserEntity[] }> {
	const container = await useContainer(requestEvent.platform.env);
	const useCase = container.resolve('GetUsersUseCase');
	const result = await useCase.execute();

	return { users: result.users };
}

/** ユーザー削除のサーバーハンドラー */
export async function deleteUserHandler(
	form: JSONObject,
	requestEvent: RequestEventAction,
): Promise<Record<string, never> | undefined> {
	const parsed = deleteUserSchema.safeParse(form);

	if (!parsed.success) {
		requestEvent.fail(400, { message: '入力が不正です' });
		return;
	}

	const container = await useContainer(requestEvent.platform.env);
	const useCase = container.resolve('DeleteUserUseCase');
	await useCase.execute({ id: parsed.data.id });

	return {};
}
