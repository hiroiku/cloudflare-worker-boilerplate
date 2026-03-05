# テスト要件

## テストランナー

vitest を唯一のテストランナーとして使用する。

| 対象ファイル | 用途 |
| --- | --- |
| `*.spec.ts` | 純粋関数・クラスのユニットテスト |
| `*.spec.tsx` | Qwik コンポーネント等、optimizer が必要なテスト |

- `.spec.tsx` は JSX やフレームワーク optimizer を実際に使用するテストにのみ使用する (それ以外は `.spec.ts`)
- テストファイルは `test/unit/` 配下に `src/` のディレクトリ構造をミラーリングして配置する
  - 例: `src/domain/entities/user.entity.ts` のテストは `test/unit/domain/entities/user.entity.spec.ts`

## テストディレクトリ構成

```
test/
├── setup.ts       # vitest グローバルセットアップ (フレームワーク仮想モジュールのモック等)
├── helpers/       # テストユーティリティ (モックプロバイダー等)
├── mock/          # 共有モックファクトリ (ポート構造をミラー)
│   ├── application/
│   │   ├── repositories/{feature}/  # Repository モック
│   │   └── services/                # Application Service モック
│   └── infrastructure/
│       └── integrations/{feature}/  # Infrastructure Integration モック
├── unit/          # ユニットテスト (src/ のディレクトリ構造をミラー)
└── integration/   # 統合テスト (機能ドメイン単位)
```

## モック化

すべてのテスト (ユニット、インテグレーション、E2E) はモック化すること。

- ユニットテスト: 外部依存 (API、DB、ファイルシステムなど) はモックする
- インテグレーションテスト: 外部サービスやリソースはモックまたはスタブで置き換える
- E2E テスト: 本番環境以外のサービスやサードパーティ API はモック化する

実物の外部リソースに依存するテストは書かないこと。

### モックファクトリパターン

ファクトリ関数の命名はサフィックスにポートの型名を含める。

| 対象 | 命名パターン | 例 |
| --- | --- | --- |
| Repository | `createMock{Name}Repository` | `createMockFooRepository` |
| Integration | `createMock{Name}Integration` | `createMockBarIntegration` |
| Service | `createMock{Name}Service` | `createMockBazService` |
| その他 | `createMock{Name}` | `createMockToolContext` |

- ファクトリ関数は `test/mock/` 配下にポート構造をミラーリングして配置する
  - Repository mock: `test/mock/application/repositories/{feature}/{name}.repository.mock.ts`
  - Service mock: `test/mock/application/services/{name}.service.mock.ts`
  - Integration mock: `test/mock/infrastructure/integrations/{feature}/{name}.mock.ts`
- spec ファイルからは `~mock/` エイリアスを使って参照する (例: `from '~mock/application/repositories/foo/foo.repository.mock'`)
- テストケース内で直接 `{ method: vi.fn() }` のようなインラインモックを繰り返さない

### モックの配置基準

共有ファクトリ (`test/mock/`) とローカルモック (spec 内定義) を使い分ける。

- 共有 (`test/mock/`): 複数の spec ファイルから参照される Repository / Service / Integration モック。`~mock/` エイリアスで参照する
- ローカル (spec 内): 1 つの spec ファイルでしか使わない UseCase モック・DB クライアントモック・コンテナ resolve モック

## 統合テスト

統合テストは複数の実クラスが協調して正しく動作することを検証する。外部 I/O 境界 (Port インターフェース) のみモックし、内部のクラス間インタラクションは実コードで実行する。

シナリオ選定基準 (いつ書くか・何を検証するか) と構造パターン (ファイル構成・buildChain ヘルパー) の詳細は [integration-test.md](integration-test.md) に従う。
統合テストの制約も [integration-test.md](integration-test.md) に定義されている。

### 配置

- `test/integration/{feature}/` に配置する
- ファイル名は `*.integration.spec.ts` とする
- 機能ドメイン単位でサブディレクトリを切る (`src/` のミラーリングは不要)

### テスト対象範囲

| レイヤー | 統合テストでの扱い |
| --- | --- |
| UseCase | 実インスタンス |
| Application Service | 実インスタンス |
| Domain Entity / Service | 実インスタンス |
| Repository Port | モック (共有ファクトリ使用) |
| Integration Port | モック (共有ファクトリ使用) |

## テストの意図をコメントで記述する

テストファイルには、各テストケースが何を意図したテストなのかコメントを残すこと。

- テストブロックの直前に、そのテストの目的や検証内容をコメントで記述する
- 複雑なアサーションやモックの設定が必要な場合は、その意図も補足する

## F.I.R.S.T. 原則

テストは以下の原則に従うこと。

- **Fast**: 高速に実行できること
- **Independent**: 他のテストに依存せず、実行順序に依存しないこと。並列実行しても安全なように、テスト間で状態を共有しない
  - モジュールスコープの変数を複数テストで変更しない
  - モックやスタブは各テストケース内で生成する (共有インスタンスを使い回さない)
  - ファイル・DB・環境変数などのグローバル状態に依存しない
- **Repeatable**: どの環境でも同じ結果になること
- **Self-validating**: 成功/失敗が自動で判定できること
- **Timely**: 実装と同時または先行して書くこと

## カバレッジの考え方

### 最低閾値 (安全ネット)

`bun run test:coverage` で閾値をチェックする。

### テストを書くべきもの

- ビジネスロジック (Entity の不変条件、UseCase のフロー制御、条件分岐)
- エラーハンドリング (`@throws` で文書化された例外には対応テストを書く)
- 入力バリデーション (境界値、異常値)
- 状態遷移 (ステータス変更、フラグ切り替え)
- 副作用の正しさ (Repository への正しい引数での呼び出し)

### テストを書かなくてよいもの

以下はカバレッジのためだけにテストを書く必要はない:

- フレームワーク (Qwik optimizer 等) がコード変換時に生成する内部関数
- TypeScript の型システムが保証する分岐 (型ガードで到達不能なパス)
- 単純なパススルー (入力をそのまま別の関数に渡すだけで変換・判定・分岐がないもの)
- getter/setter で自明な値を返すのみのもの
- 外部ライブラリの挙動そのもの (自プロジェクトが正しく呼び出すことのテストは書く)

## テストの価値判定

テストを書く際は「このテストが失敗したら、プロダクションに問題があると確信できるか?」を自問する。答えが No なら、そのテストは不要。

### 価値のあるテストの特徴

- 入力と期待出力の関係にビジネス上の意味がある
- テストが失敗したとき、どのビジネスルールが壊れたか特定できる
- モックの設定とアサーションの間に、テスト対象の変換・判定・分岐ロジックが介在する

---

## 制約

### MUST NOT

- カバレッジ除外コメント (`/* istanbul ignore */`, `/* c8 ignore */`, `/* v8 ignore */` 等) を実装コードに記述しない
  理由: テスト不能なコードの存在を隠蔽し、設計上の問題を見逃す原因になる

- 構造的デッドテストを残さない
  理由: 実行されないテストはメンテナンスコストを浪費し、「テストがある」という誤った安心感を与える
  対象:
  - `it.skip()` / `test.skip()` / `describe.skip()` / `xit()` / `xdescribe()` を理由コメントや TODO なしに放置したもの
  - `it()` / `test()` のボディが空、または `TODO` / `FIXME` コメントのみで実装が書かれていないテスト
  - 対応する実装ファイルが存在しないテストファイル (リネーム・削除後の残骸)

- カバレッジ数値を上げることを目的としたテストを書かない (上記「価値のないテスト」参照)
  理由: カバレッジは品質の指標であって目標ではない。数値のためのテストは保守コストのみ増加する

- カバレッジ数値を上げることを目的としたプロダクションコードの変更をしない
  理由: プロダクションコードの品質とカバレッジ数値が衝突する場合、プロダクションコードの品質を優先する

### 価値のないテスト (MUST NOT)

カバレッジに寄与するがビジネスロジックの正しさを保証しないテストは書かない:

- トートロジーアサーション: `expect(true).toBe(true)` のようなテスト対象と無関係な定数比較
- 存在確認のみ: `expect(result).toBeDefined()` / `.not.toBeNull()` が唯一のアサーションで、値の正しさを検証しないテスト
- モックエコー: モックに仕込んだ戻り値をそのまま `expect` するだけで、間に変換・判定・分岐ロジックがないテスト
- 型だけの検証: `expect(result).toBeInstanceOf(X)` や `typeof` チェックのみで、値の内容を検証しないテスト
- 呼び出し検証のみ: `expect(mock).toHaveBeenCalled()` だけで、引数や戻り値に対するアサーションがないテスト (副作用のない関数の場合)
- 重複テスト: 同一の入力・モック設定・アサーションを異なるテスト名で繰り返すテスト

---

実装パターン (コードテンプレート、テスト構造規約) は [test-patterns.md](test-patterns.md) を参照。
