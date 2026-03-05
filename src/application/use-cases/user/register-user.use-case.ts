import type { UserRepository } from '~/application/ports/repositories/user/user.repository';
import type { ISerializedUserEntity } from '~/domain/entities/user.entity';
import { UserEntity } from '~/domain/entities/user.entity';

/** ユーザー登録の入力 */
export interface RegisterUserInput {
	readonly email: string;
}

/** ユーザー登録の出力 */
export interface RegisterUserOutput {
	readonly user: ISerializedUserEntity;
}

/**
 * ユーザー登録ユースケース
 *
 * 新規ユーザーを作成し、永続化する。
 */
export class RegisterUserUseCase {
	private readonly userRepository: UserRepository;

	public constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * ユーザーを登録する
	 *
	 * @param input ユーザー登録データ
	 * @returns 登録されたユーザー
	 */
	public async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
		const record = await this.userRepository.save({
			email: input.email,
		});

		const user = new UserEntity({
			id: record.id,
			email: record.email,
			createdAt: record.createdAt,
			updatedAt: record.updatedAt,
		});

		return { user: user.serialize() };
	}
}
