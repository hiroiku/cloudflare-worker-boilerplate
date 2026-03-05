import { DomainError } from '~/app-kernel/errors/domain.error';

/**
 * ユーザーが見つからない場合のドメインエラー
 */
export class UserNotFoundError extends DomainError {}
