import type { UserRepository } from '~/application/ports/repositories/user/user.repository';
import type { IUserSerializedEntity } from '~/domain/entities/user.entity';
import { UserEntity } from '~/domain/entities/user.entity';

/** ユーザー一覧取得の出力 */
export interface GetUsersOutput {
	readonly users: IUserSerializedEntity[];
}

/**
 * ユーザー一覧取得ユースケース
 *
 * 全ユーザーを取得する。
 */
export class GetUsersUseCase {
	private readonly userRepository: UserRepository;

	public constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * 全ユーザーを取得する
	 *
	 * @returns ユーザー一覧 (createdAt 降順)
	 */
	public async execute(): Promise<GetUsersOutput> {
		const records = await this.userRepository.findAll();

		const users = records.map(record =>
			new UserEntity({
				id: record.id,
				email: record.email,
				createdAt: record.createdAt,
				updatedAt: record.updatedAt,
			}).serialize(),
		);

		return { users };
	}
}
