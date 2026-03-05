import { BaseError } from './base.error';

/**
 * アプリケーション層で発生するエラーの基底クラス
 *
 * ユースケースの実行失敗やオーケストレーション時の問題など、
 * アプリケーションロジックに関するエラーを表現する。
 * Application層のすべてのエラーはこのクラスを継承する。
 */
export class ApplicationError extends BaseError {}
