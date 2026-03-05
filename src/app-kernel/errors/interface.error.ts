import { BaseError } from './base.error';

/**
 * インターフェース層で発生するエラーの基底クラス
 *
 * コントローラーやプレゼンター、ゲートウェイなど、
 * 外部とのデータ変換やAPI処理に関するエラーを表現する。
 * Interface層のすべてのエラーはこのクラスを継承する。
 */
export class InterfaceError extends BaseError {}
