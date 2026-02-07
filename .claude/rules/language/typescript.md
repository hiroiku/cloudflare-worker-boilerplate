---
paths: ['*.ts', '*.tsx']
---

# TypeScript 固有規約

JavaScript/TypeScript 共通の規約については [`javascript.md`](./javascript.md) を参照してください。

このファイルでは TypeScript 固有の規約のみを定義します。

---

## クラス

- クラスプロパティは `readonly` を使用する。
- すべてのクラスメンバーと `constructor` にアクセス修飾子を明示する。
- パラメータプロパティは禁止する。クラスのメンバーとして明示的に定義すること。

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

- 非 null アサーション(`!`)は禁止する。`strictNullChecks=true` を前提とする。

## 型安全

- `any` の使用を禁止する。`unknown` と型ガード/判別可能ユニオン/ジェネリクスで解決する。
- 安易な型アサーション(`as`/角括弧記法)での回避を禁止する。型不一致は設計・型定義を見直して解消する。
- 型ナローイング(`in`/`typeof`/`instanceof`/ユーザー定義型ガード)を優先する。
- 外部入力は `unknown` で受け、スキーマ検証やガード後に安全な型へ変換する。

## ドキュメント

### JSDoc での型情報

- JSDoc に型を重複して書かない（TypeScript の型定義を信頼する）
- `@param`、`@returns` は説明文のみ記載する
- `@throws` は例外の型と発生条件を記載する

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
