import type { IEntity } from '~/app-kernel/types/entity';

/**
 * User エンティティのプロパティ (ドメイン内用スナップショット)
 */
export interface IUserEntity {
	readonly id: string;
	readonly email: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

/**
 * シリアライズ境界を越えるユーザースナップショット (Date → string)
 */
export interface ISerializedUserEntity {
	readonly id: string;
	readonly email: string;
	readonly createdAt: string;
	readonly updatedAt: string;
}

/**
 * ユーザーエンティティ
 *
 * ID (cuid) で識別する。
 */
export class UserEntity implements IEntity<IUserEntity, ISerializedUserEntity> {
	public readonly id: string;
	public readonly email: string;
	public readonly createdAt: Date;
	public readonly updatedAt: Date;

	public constructor(entity: IUserEntity) {
		this.id = entity.id;
		this.email = entity.email;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;
	}

	public serialize(): ISerializedUserEntity {
		return {
			id: this.id,
			email: this.email,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
		};
	}
}
