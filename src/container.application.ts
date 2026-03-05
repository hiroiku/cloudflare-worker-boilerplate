import { createContainer } from 'katagami';
import { DeleteUserUseCase } from '~/application/use-cases/user/delete-user.use-case';
import { GetUsersUseCase } from '~/application/use-cases/user/get-users.use-case';
import { RegisterUserUseCase } from '~/application/use-cases/user/register-user.use-case';
import type { InfrastructureService } from '~/container.infrastructure';

/** Application 層のトークン型マップ */
export interface ApplicationService {
	DeleteUserUseCase: DeleteUserUseCase;
	GetUsersUseCase: GetUsersUseCase;
	RegisterUserUseCase: RegisterUserUseCase;
}

/** Application 層のサービスを登録したコンテナを構築する */
export function buildApplicationContainer() {
	return createContainer<InfrastructureService & ApplicationService>()
		.registerTransient('RegisterUserUseCase', r => new RegisterUserUseCase(r.resolve('UserRepository')))
		.registerTransient('GetUsersUseCase', r => new GetUsersUseCase(r.resolve('UserRepository')))
		.registerTransient('DeleteUserUseCase', r => new DeleteUserUseCase(r.resolve('UserRepository')));
}
