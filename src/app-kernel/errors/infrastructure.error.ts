import { BaseError } from './base.error';

/**
 * インフラストラクチャ層で発生するエラーの基底クラス
 *
 * データベース、外部API、ファイルシステムなど、
 * 技術的な実装や外部サービスとの通信に関するエラーを表現する。
 * Infrastructure層のすべてのエラーはこのクラスを継承する。
 */
export class InfrastructureError extends BaseError {}
