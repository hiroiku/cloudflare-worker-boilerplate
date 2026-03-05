/**
 * アプリケーション全体で使用するエラーの基底クラス
 *
 * すべてのカスタムエラーはこのクラスを継承する。
 * new.target を使用して name とプロトタイプチェーンを自動設定するため、
 * サブクラスでは constructor の定義が不要。
 */
export class BaseError extends Error {
	/**
	 * BaseError のインスタンスを生成する
	 *
	 * @param message エラーメッセージ
	 * @param options エラーオプション (cause でラップ元のエラーを指定可能)
	 */
	public constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = new.target.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
