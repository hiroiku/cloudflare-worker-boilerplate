---
paths: ['*.ts', '*.tsx']
---

# TypeScript 固有規約

JavaScript/TypeScript 共通の規約については [`javascript.md`](./javascript.md) を参照。

このファイルでは TypeScript 固有の規約のみを定義する。

---

## クラス

### MUST

- クラスプロパティは `readonly` を使用する
  理由: 不変性を担保し、意図しない再代入を防ぐ
- すべてのクラスメンバーと `constructor` にアクセス修飾子を明示する
  理由: 可視性が暗黙的だと、公開 API の範囲が不明確になる

### MUST NOT

- パラメータプロパティを使用しない
  理由: クラスのメンバー定義が constructor シグネチャに隠れ、可読性が低下する
  代わりに: クラスのメンバーとして明示的に定義し、constructor で代入する

  ```ts
  // NG
  class Example {
  	public constructor(private readonly param: Param) {}
  }

  // OK
  class Example {
  	private readonly param: Param;

  	public constructor(param: Param) {
  		this.param = param;
  	}
  }
  ```

## null 安全

### MUST NOT

- 非 null アサーション (`!`) を使用しない。`strictNullChecks=true` を前提とする
  理由: ランタイムで null/undefined が到達した場合に予測不能なエラーになる
  代わりに: Optional chaining (`?.`) と nullish coalescing (`??`) で安全にアクセスするか、型ガードで絞り込む

## 型安全

### MUST NOT

- `any` を使用しない
  理由: 型チェックが無効化され、コンパイル時にバグを検出できなくなる
  代わりに: `unknown` と型ガード/判別可能ユニオン/ジェネリクスで解決する

- 安易な型アサーション (`as` / 角括弧記法) で型不一致を回避しない
  理由: 型アサーションはコンパイラの型チェックを無視するため、ランタイムエラーの原因になる
  代わりに: 型定義や設計を見直して型不一致を解消する

### MUST

- 型ナローイング (`in` / `typeof` / `instanceof` / ユーザー定義型ガード) を優先する
- 外部入力は `unknown` で受け、スキーマ検証やガード後に安全な型へ変換する

## ドキュメント

### JSDoc での型情報

### MUST NOT

- JSDoc に型を重複して書かない (TypeScript の型定義を信頼する)
  理由: 型情報が二重管理になり、乖離が発生する

  ```ts
  // OK - 型は TS、説明は JSDoc
  /**
   * ユーザーを ID で検索する
   * @param id 検索対象のユーザー ID
   * @returns 見つかったユーザー
   * @throws {NotFoundError} ユーザーが存在しない場合
   */
  public findById(id: string): User { ... }

  // NG - 型情報を重複して記載
  /**
   * @param {string} id
   * @returns {User}
   */
  ```

### MUST

- `@param`、`@returns` は説明文のみ記載する
- `@throws` は例外の型と発生条件を記載する
