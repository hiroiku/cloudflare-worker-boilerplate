/**
 * Entity の共通インターフェース。
 * 読み取り専用の内部状態と、プレーンオブジェクトへの変換メソッドを定義する。
 *
 * @template TInternal - Entity の内部状態の型
 * @template TSerialized - シリアライズ結果の型 (省略時は TInternal)
 */
export type IEntity<TInternal, TSerialized = TInternal> = Readonly<TInternal> & {
	/**
	 * Entity をプレーンオブジェクトに変換する
	 *
	 * @returns プレーンオブジェクト
	 */
	serialize(): TSerialized;
};

/**
 * シリアライズ境界越え用の型。
 * 元の型 T の一部プロパティを Overrides で上書きした型を表す。
 * API レスポンス等で Date を ISO 文字列に変換する場合などに使用する。
 *
 * @template T - 元の型
 * @template Overrides - 上書きするプロパティのマップ
 */
export type SerializedEntity<T, Overrides extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof Overrides> &
	Readonly<Overrides>;
