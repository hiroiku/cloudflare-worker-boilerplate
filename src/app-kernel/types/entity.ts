export type IEntity<TInternal, TSerialized = TInternal> = Readonly<TInternal> & {
	/**
	 * Entity をプレーンオブジェクトに変換する
	 *
	 * @returns プレーンオブジェクト
	 */
	serialize(): TSerialized;
};
