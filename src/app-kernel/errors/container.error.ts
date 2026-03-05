import { BaseError } from './base.error';

/**
 * DI コンテナで発生するエラー
 *
 * 未登録トークンの resolve など、コンテナ操作の失敗を表現する。
 */
export class ContainerError extends BaseError {}
