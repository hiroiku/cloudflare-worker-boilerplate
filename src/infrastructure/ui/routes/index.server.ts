import type { RequestEventAction, RequestEventLoader } from '@builder.io/qwik-city';
import { useContainer } from '~/container';
import type { ISerializedUserEntity } from '~/domain/entities/user.entity';

/** ユーザー登録のサーバーハンドラー */
export async function registerUserHandler(
	data: { email: string },
	requestEvent: RequestEventAction,
): Promise<{ user: ISerializedUserEntity }> {
	const container = await useContainer(requestEvent.platform.env);
	const useCase = container.resolve('RegisterUserUseCase');
	const result = await useCase.execute({ email: data.email });

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
	data: { id: string },
	requestEvent: RequestEventAction,
): Promise<Record<string, never>> {
	const container = await useContainer(requestEvent.platform.env);
	const useCase = container.resolve('DeleteUserUseCase');
	await useCase.execute({ id: data.id });

	return {};
}
