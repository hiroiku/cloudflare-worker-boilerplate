import { BaseError } from './base.error';

/**
 * ドメイン層で発生するエラーの基底クラス
 *
 * ビジネスルール違反や不変条件の破壊など、ドメインロジックに関するエラーを表現する。
 * Domain層のすべてのエラーはこのクラスを継承する。
 */
export class DomainError extends BaseError {}
