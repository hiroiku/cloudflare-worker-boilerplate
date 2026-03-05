import type { UserRepository } from '~/application/ports/repositories/user/user.repository';
import { UserNotFoundError } from '~/domain/errors/user-not-found.error';

/** ユーザー削除の入力 */
export interface DeleteUserInput {
	readonly id: string;
}

/** ユーザー削除の出力 */
export interface DeleteUserOutput {}

/**
 * ユーザー削除ユースケース
 *
 * 指定された ID のユーザーを削除する。
 */
export class DeleteUserUseCase {
	private readonly userRepository: UserRepository;

	public constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * ユーザーを削除する
	 *
	 * @param input 削除するユーザーの入力
	 * @returns 空のオブジェクト
	 * @throws {UserNotFoundError} 指定された ID のユーザーが存在しない場合
	 */
	public async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
		const existing = await this.userRepository.findById(input.id);

		if (!existing) {
			throw new UserNotFoundError(`User with id "${input.id}" not found`);
		}

		await this.userRepository.deleteById(input.id);

		return {};
	}
}
