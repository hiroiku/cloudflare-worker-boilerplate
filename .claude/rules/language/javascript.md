---
paths: ['*.js', '*.jsx', '*.ts', '*.tsx']
---

# JavaScript/TypeScript 共通規約

このファイルは JavaScript と TypeScript で共通のコーディング規約を定義します。

TypeScript 固有の規約については [`typescript.md`](./typescript.md) を参照してください。

---

## 変数・定数

- 変数は `const` を優先し、`let` は最小限。不変性を担保し安全にするため。

## 関数

- 純粋関数には `function` を使用する。

## クラス

- クラスプロパティは不変にする（JavaScript では凍結、TypeScript では `readonly`）。不変性を担保し安全にするため。
- `constructor` のパラメータプロパティは禁止する。クラスのメンバーとして明示的に定義し、`constructor` で受け取ること。

  ```js
  // JavaScript の場合
  class Example {
    #param;

    constructor(param) {
      this.#param = param;
    }
  }
  ```

## null 安全

- null 判定は `??` を使用する。

## ドキュメント

### JSDoc の対象

- **必須**: public API（エクスポートされるクラス、関数、public メソッド/プロパティ）
- **任意**: private/protected メンバー（複雑なロジックの場合は推奨）

### 記載内容

- クラス: 説明文と責務
- メソッド/関数: 説明文、`@param`（各引数の説明）、`@returns`（戻り値の説明）
- プロパティ: 名前から不明瞭な場合のみ説明文

### 例外ドキュメント

- 例外を投げる可能性がある場合は `@throws` を必ず記載する
- 例外の型と発生条件を明記する
- 複数の例外を投げる場合は、それぞれ個別に記載する

  ```js
  /**
   * ユーザーを ID で取得する
   * @param id ユーザー ID
   * @returns ユーザー情報
   * @throws {NotFoundError} 指定された ID のユーザーが存在しない場合
   * @throws {ValidationError} ID の形式が不正な場合
   */
  function getUser(id) { ... }
  ```

### 省略可能なケース

- getter/setter で名前から明らかな場合
- コンストラクタで依存注入のみの場合
- `id`、`name` など自明なプロパティ

### 追加タグ

- `@example`: 使用例を示す場合
- `@see`: 関連ドキュメントへの参照
- `@deprecated`: 非推奨の場合（代替手段を明記）
- `@url`: 仕様の出典

## イテレーション

- 配列処理では `Array.prototype.forEach()` より `for` 文を優先して使う。

## モジュール

- バレルエクスポート（`index.js` による再エクスポート）は禁止する。
  - ツリーシェイキングが効きにくく、循環参照の原因になりやすい。
  - 各モジュールから直接インポートすること。

  ```js
  // NG - バレルエクスポート経由
  import { BaseError } from '@/app-kernel';
  import { BaseError } from '@/app-kernel/index.js';

  // OK - 直接インポート
  import { BaseError } from '@/app-kernel/errors/base-error.js';
  ```

## パス操作

- ESM 環境でのディレクトリパス解決には `import.meta.dirname` を使用する
- `fileURLToPath(import.meta.url)` は冗長なため使用しない

  ```js
  // NG - 冗長
  import path from 'node:path';
  import { fileURLToPath } from 'node:url';

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const configPath = path.join(__dirname, 'config.json');

  // OK - シンプル
  import path from 'node:path';

  const configPath = path.join(import.meta.dirname, 'config.json');
  ```
