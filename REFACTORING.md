# リファクタリング分析レポート

**分析日時**: 2026-03-05 04:38
**スコープ**: src/
**検出件数**: Critical: 6 / Warning: 13 / Suggestion: 8
**自動修正可能件数**: 11 件

---

## ステータス凡例

- `[ ]` 未対応
- `[x]` 対応済み
- `[-]` スキップ (設計変更を伴うため手動対応が必要)

---

## Critical (即座に対応が必要)

### [Arch] アーキテクチャ

- [ ] **[A-9: index.tsx でのインラインスタイル使用]** -- `src/infrastructure/ui/routes/index.tsx:74`
  - 問題: `<div style={{ marginTop: '1.5rem' }}>` でインラインスタイルが使用されている。Qwik 規約 MUST NOT「インラインスタイル (`style` 属性) を使用しない (CSS カスタムプロパティの注入および動的な数値バインディングを除く)」に違反
  - 影響: スタイルの一元管理ができず、CSS Modules の利点が失われる。同パターンが増えるとスタイル追跡が困難になる
  - 修正案: `index.module.css` に `.success-wrapper { margin-top: 1.5rem; }` を追加し、`class={styles.successWrapper}` に置き換える
  - 自動修正可能: はい

### [Sec] セキュリティ

- [ ] **[S-1: registerUserHandler の email バリデーション不足]** -- `src/infrastructure/ui/routes/index.server.ts:5-16`
  - 問題: `email` の存在チェック (空文字判定) のみでスキーマバリデーションが適用されていない。`String(form.email)` で任意の文字列がそのまま UseCase → Repository に渡され、メールアドレスの形式検証がない
  - 影響: 不正な形式のメールアドレスがデータベースに保存される可能性がある。蓄積型 XSS の入力ベクターとなりうる
  - 修正案: Zod スキーマで `z.string().email()` を適用し、Interface 層の Validator として定義する
  - 自動修正可能: はい

- [ ] **[S-1: deleteUserHandler の id バリデーション不足]** -- `src/infrastructure/ui/routes/index.server.ts:41-54`
  - 問題: `id` の空文字チェックのみで ID の形式検証 (cuid 形式等) がない。任意の文字列が `findById()` → `deleteById()` に渡される
  - 影響: 不正な ID 文字列による不要な DB クエリが発生する。Prisma のパラメータ化クエリで直接インジェクションリスクは低いが、認可チェックと組み合わせると IDOR 脆弱性に直結する
  - 修正案: Zod スキーマで `z.string().cuid()` または適切な形式で検証する
  - 自動修正可能: はい

### [Test] テスト品質

- [ ] **[Q-1: RegisterUserUseCase テストがモックエコーパターン]** -- `test/unit/application/use-cases/user/register-user.use-case.spec.ts:20`
  - 問題: モックの `save` が返す `savedRecord` の値がほぼそのまま `expect` で検証されている。UseCase の `execute()` は `record` を `UserEntity` にマッピングして `serialize()` するだけで、変換・判定・分岐ロジックが介在していない
  - 影響: このテストが失敗しても UserEntity のマッピングミスしか検出できず、ビジネスルールの破壊を示唆しない
  - 修正案: 2 番目のテスト (引数キャプチャ) のみで十分であり、1 番目は削除候補。UseCase にビジネスルール (重複チェック等) が追加された際に拡充する
  - 自動修正可能: はい

- [ ] **[Q-1: GetUsersUseCase テストがモックエコーパターン]** -- `test/unit/application/use-cases/user/get-users.use-case.spec.ts:31`
  - 問題: `findAll` モックに設定した UserRecord 配列が UseCase を通じてそのまま返される (Entity マッピング → serialize のみ) ことを検証しており、変換・判定・分岐ロジックが介在しない
  - 影響: パススルーの検証に留まり、ビジネスルールの破壊を検出できない
  - 修正案: 空配列テスト (1 番目) は境界値検証として価値がある。2 番目は UseCase にフィルタリング等のロジックが追加された際に意味を持つため、現時点では削除または意図を明示したコメントに限定化する
  - 自動修正可能: はい

- [ ] **[Q-14: UserEntity テストに型のみ検証テストが存在]** -- `test/unit/domain/entities/user.entity.spec.ts:40`
  - 問題: `expect(serialized).not.toBeInstanceOf(UserEntity)` のみで、型だけの検証に該当する。`serialize()` がプレーンオブジェクトを返す以上、これが `UserEntity` のインスタンスになることは構造的にあり得ない
  - 影響: 常に成功するテストであり、ビジネスルールの保証に寄与しない
  - 修正案: このテストを削除する。`serialize()` の正しさは 2 番目の `toEqual` テストで十分に検証されている
  - 自動修正可能: はい

---

## Warning (早期に対応推奨)

### [Arch] アーキテクチャ

- [x] **[A-8: useContainer の非同期キャッシュパターンが規約の文言と乖離]** -- `src/container.ts:22-28`
  - 問題: Katagami 規約では `cachedContainer ??= buildContainer(env)` パターンが推奨されているが、実装は `if (cachedContainer === undefined)` で分岐し `await` している。非同期関数のため `??=` は使えない事情があり動作上は同等
  - 影響: 軽微。動作上の問題はないが、規約との乖離が認識されていた
  - 対応: `clean-architecture.md` に非同期キャッシュパターン (`if (cachedContainer === undefined)`) を正式に定義した

- [x] **[A-8: container.ts のファイル分割パターンが規約に未定義]** -- `src/container.ts`, `src/container.infrastructure.ts`, `src/container.interface.ts`, `src/container.application.ts`
  - 問題: 層別ファイル分割パターンが規約に明示されていなかった
  - 対応: `clean-architecture.md` に「DI Container の構成パターン」セクションを追加し、層別分割パターン (`container.{layer}.ts`) と非同期キャッシュパターンを定義した

### [Maint] 保守性

- [ ] **[M-8: CSS マジックナンバーがカスタムプロパティ化されていない]** -- 複数 CSS ファイル
  - 問題: 色値 (`#0f172a`, `#64748b`, `#334155`, `#dc2626` 等) が全 CSS ファイルにハードコードされている。CSS 規約では「マジックナンバーをカスタムプロパティに抽出する」ことが MUST
  - 影響: テーマの一貫性維持が困難になり、色変更時に全ファイルの修正が必要
  - 対象ファイル: `src/infrastructure/ui/root.css`, `routes/index.module.css`, `components/primitives/button/Button.module.css`, `input-field/InputField.module.css`, `card/Card.module.css`, `badge/Badge.module.css`, `success-message/SuccessMessage.module.css`
  - 修正案: `root.css` の `:root` に `--color-primary`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-danger` 等のカスタムプロパティを定義し、各 CSS Modules から参照する
  - 自動修正可能: いいえ (デザイントークンの命名設計が必要)

- [ ] **[M-5: PrismaUserRepository の public メソッドに JSDoc がない]** -- `src/infrastructure/repositories/user/user.repository.ts:21,34,45,52`
  - 問題: `findById`, `save`, `findAll`, `deleteById` の各 public メソッドに JSDoc がない。Port インターフェース側にはあるが、具象実装側にもクラス・メソッドレベルの JSDoc が規約上必要
  - 影響: 実装固有の挙動や制約が文書化されず、保守時の情報が不足する
  - 修正案: 各メソッドに JSDoc を追加する。Port の JSDoc と重複する場合は `@see UserRepository` で参照してもよい
  - 自動修正可能: はい

### [Perf] パフォーマンス

- [-] **[P-5: GetUsersUseCase の全件取得にページネーションがない]** -- `src/application/use-cases/user/get-users.use-case.ts:28`
  - 問題: `findAll()` がページネーションなしで全件取得している。ユーザー数増加時にレスポンスサイズとクエリ負荷が線形に増大する
  - 影響: データ量増加時に O(N) のメモリ使用量とレスポンス遅延。Cloudflare Workers のメモリ制限 (128MB) やレスポンスサイズ制限に抵触するリスク
  - 修正案: `findAll()` に `limit`/`offset` または cursor-based pagination を追加し、UI 側でページネーション UI を実装する
  - 自動修正可能: いいえ (API 設計変更が必要)
  <!-- スキップ: 設計変更を伴うため手動対応が必要 -->

### [Type] 型安全性

- [ ] **[T-3: `as unknown as PrismaClient` ダブルキャスト]** -- `src/container.infrastructure.ts:26`
  - 問題: `$extends(withAccelerate())` の戻り値を `as unknown as PrismaClient` でダブルキャストしている。`unknown` を経由するキャストは型安全性を完全に無効化する
  - 影響: Prisma の `$extends()` が返す拡張型と `PrismaClient` の間に構造的差異がある場合、ランタイムエラーの可能性がある
  - 修正案: コメントで「拡張クライアントは PrismaClient の完全なスーパーセット」と説明されており、Prisma の型設計の制約上やむを得ないケース。Prisma が将来的に型互換のある API を提供した場合に解消する
  - 自動修正可能: いいえ (Prisma の型設計の制約)

### [Sec] セキュリティ

- [-] **[S-3: deleteUserHandler の認可チェック不足]** -- `src/infrastructure/ui/routes/index.server.ts:41-54`
  - 問題: ユーザー削除アクションに認証・認可チェックがない。誰でも任意のユーザー ID を指定して削除リクエストを送信できる
  - 影響: 認証されていないユーザーが他のユーザーのデータを削除できる。機能追加時に IDOR 脆弱性に直結する
  - 修正案: 認証ミドルウェア (レイアウトガード) を追加し、access-control.md の規約に従い認可サービスのアサートメソッドを UseCase 内で呼び出す
  - 自動修正可能: いいえ (認証基盤の設計が必要)
  <!-- スキップ: 設計変更を伴うため手動対応が必要 -->

- [-] **[S-2: 全ルートに認証保護なし]** -- `src/infrastructure/ui/routes/layout.tsx:1-8`
  - 問題: ルートレイアウト (`layout.tsx`) に認証ガード (`onRequest`) が設定されていない。全ルート (ユーザー一覧・登録・削除) が認証なしでアクセス可能
  - 影響: ボイラープレートとして現時点では問題ないが、機能追加時に認証保護の実装漏れが発生しやすい構造
  - 修正案: 認証が必要なルートグループに対してレイアウトガードを追加する (rules/architecture/access-control.md の「階層構造」パターンに従う)
  - 自動修正可能: いいえ (認証基盤の設計が必要)
  <!-- スキップ: 設計変更を伴うため手動対応が必要 -->

- [ ] **[S-1: registerUserHandler のエラーハンドリング不足]** -- `src/infrastructure/ui/routes/index.server.ts:13-22`
  - 問題: UseCase の `execute()` が投げうるエラー (DB 制約違反、重複メール等) がキャッチされていない。未処理例外がフレームワークのデフォルトエラーハンドラーに渡され、スタックトレースやエラー詳細がクライアントに漏洩する可能性がある
  - 影響: 内部エラーの詳細 (DB テーブル名、カラム名、Prisma エラーコード等) がレスポンスに含まれ、攻撃者に内部構造の情報を提供してしまう
  - 修正案: try/catch で UseCase のエラーをキャッチし、ユーザー向けの汎用エラーメッセージを返す。`deleteUserHandler` でも `UserNotFoundError` の処理を追加する
  - 自動修正可能: はい

### [Test] テスト品質

- [ ] **[Q-10: バリデーター・マッパーのテストファイルが欠如]** -- `src/interface/validators/user/`, `src/interface/mappers/user/`
  - 問題: バリデーションスキーマ (`registerUserSchema`, `deleteUserSchema`) と `toSerializedUserDto` 関数に対応するテストファイルが存在しない。バリデーションは入力境界の検証であり、マッパーは `Date` → `string (ISO 8601)` の変換を含む単純なパススルー以上のロジック
  - 影響: 不正なメール形式・空文字列・長すぎる入力等の境界値テストが欠如。Date 変換ロジックの回帰を検出できない
  - 修正案: `test/unit/interface/validators/user/register-user.validator.spec.ts`, `delete-user.validator.spec.ts`, `test/unit/interface/mappers/user/user.mapper.spec.ts` を作成し、正常値・境界値・異常値のテストを追加する
  - 自動修正可能: いいえ (テストケースの設計が必要)

- [ ] **[Q-10: PrismaUserRepository のテストが欠如]** -- `src/infrastructure/repositories/user/user.repository.ts`
  - 問題: `PrismaUserRepository` に対応するテストファイルが存在しない。クエリの `select` フィールド指定や `orderBy` 等の正しさが検証されない
  - 影響: リポジトリ実装の変更に対する回帰検証ができない
  - 修正案: 統合テスト (`test/integration/user/user.integration.spec.ts`) を作成し、UseCase + Repository の協調動作を検証する。ユニットテストでの Prisma Client モックは推奨しない
  - 自動修正可能: いいえ

- [ ] **[Q-5: UserEntity テストで describe ブロック外に Date オブジェクトを共有]** -- `test/unit/domain/entities/user.entity.spec.ts:5`
  - 問題: `const now = new Date('2026-01-01T00:00:00Z')` が `describe` ブロック直下に定義されている。`Date` オブジェクトは可変 (mutate 可能) であるため、テスト間でのミューテーションリスクがゼロではない
  - 影響: 現時点では実害はないが、テストケース追加時にミューテーションバグの温床になりうる
  - 修正案: 各テスト内のローカル変数として Date を生成するか、`Object.freeze` を適用する
  - 自動修正可能: はい

---

## Suggestion (改善提案)

### [Arch] アーキテクチャ

- [x] **[A-6: DI コンテナ分割ファイルの命名パターンが規約テーブルにない]** -- `src/container.infrastructure.ts`, `src/container.interface.ts`, `src/container.application.ts`
  - 問題: ファイル命名規則テーブルに `container.{層名}.ts` のパターンが定義されていなかった
  - 対応: `clean-architecture.md` のファイル命名規則テーブルに `container.{layer}.ts` 等のエントリーポイント行を追加した

### [Maint] 保守性

- [ ] **[M-4: container.infrastructure.ts の `let client` を IIFE パターンに変換]** -- `src/container.infrastructure.ts:22`
  - 問題: `let client: PrismaClient;` が使用されているが、if/else の各ブランチで 1 回ずつ代入されるのみ。`const` に直接置換するには IIFE パターンが必要
  - 影響: `common.md` の三項演算子禁止に対する推奨パターンとも合致する IIFE パターンへの統一が望ましい
  - 修正案: `const client = (() => { if (...) { return ...; } else { return ...; } })();` に書き換える
  - 自動修正可能: はい

- [ ] **[M-2: index.tsx コンポーネント関数が約 90 行と過大]** -- `src/infrastructure/ui/routes/index.tsx:46-136`
  - 問題: トップページのコンポーネント関数が登録フォーム・成功メッセージ・ユーザーテーブル・空状態の 4 つの関心を含んでいる
  - 影響: 可読性の低下。機能追加時に肥大化しやすい
  - 修正案: テーブル部分を `UserTable` コンポーネントとして抽出し、空状態表示も分離することを検討する
  - 自動修正可能: いいえ

### [Perf] パフォーマンス

- [ ] **[P-4: buildContainer 内の Promise.all が単一要素のみ]** -- `src/container.ts:36`
  - 問題: `await Promise.all([import('~/container.infrastructure')])` として動的 import を使用しているが、要素が 1 つしかないため `Promise.all` の並列化メリットがない
  - 影響: コード上の不要な複雑さ。パフォーマンスへの実影響は軽微 (動的 import 自体のオーバーヘッドのみ)
  - 修正案: `Promise.all` を除去し `const { buildInfrastructureContainer } = await import('~/container.infrastructure')` に簡略化する。または将来の拡張予定がなければ静的 import に変更する
  - 自動修正可能: はい

### [Sec] セキュリティ

- [ ] **[S-8: 将来の API エンドポイント追加時に CSRF 保護が必要]** -- `src/infrastructure/ui/routes/index.tsx:25-33`
  - 問題: `routeAction$` は QwikCity の Form コンポーネント経由でフレームワークレベルの CSRF トークンが自動付与されるが、将来 API エンドポイントを追加する際は別途 CSRF 保護が必要
  - 影響: 今後の API 追加時にセキュリティ保護の考慮漏れが発生しやすい
  - 修正案: API エンドポイント追加時に CSRF 保護の実装を検討する
  - 自動修正可能: いいえ

### [Test] テスト品質

- [ ] **[Q-12: UserEntity に不変条件チェックが追加された際の境界値テスト追加]** -- `test/unit/domain/entities/user.entity.spec.ts`
  - 問題: `UserEntity` のコンストラクタに対して、空文字列の `id`/`email`、`null`/`undefined` フィールド、不正な Date 値などの境界値テストが存在しない。現在の実装にはバリデーションロジックがないため現時点では常にパスする
  - 影響: Entity にバリデーション (不変条件チェック) が追加された際にテストが欠如した状態になる
  - 修正案: Entity に不変条件チェックを追加する際に境界値テストも同時に追加する
  - 自動修正可能: いいえ

---

## 良好な項目

### [Arch] アーキテクチャ

- **A-1 (層間依存方向)**: 全ファイルで依存方向が正しい。Domain は app-kernel のみ、UseCase から Infrastructure/Interface への import はなし
- **A-2 (Port を介さない I/O)**: 全 UseCase が Port インターフェース経由のみ。直接的な DB/HTTP アクセスなし
- **A-3 (外部 SDK 型漏洩)**: UseCase I/O 型・Port インターフェースにフレームワーク/SDK の型は一切含まれていない
- **A-4 (Entity 実装規約)**: `UserEntity` は `IEntity<IUserEntity>` を正しく実装。スナップショット型・`serialize()` とも規約準拠
- **A-5 (UseCase I/O co-locate)**: 全 UseCase の Input/Output 型がファイル内に co-locate されている
- **A-7 (エラークラス階層)**: 全エラークラスが正しい基底クラスを継承
- **A-10 (UI コンポーネント配置)**: `primitives/` 配下の全コンポーネントがドメイン型依存なし。配置判断フローに準拠
- **A-11 (app-kernel の制約)**: app-kernel にプロジェクト固有のビジネスロジック・DI トークン・設定定数なし

### [Maint] 保守性

- **M-1 (その他の禁止パターン)**: 三項演算子・`forEach`・バレルエクスポート・`eslint-disable`・`@ts-ignore`・非 null アサーション・`any` 型・`process.env` いずれも未使用
- **M-3 (命名規約)**: camelCase・PascalCase・UPPER_SNAKE_CASE・Boolean プレフィックス等、全般的に良好
- **M-6 (@throws ドキュメント)**: `DeleteUserUseCase.execute()` に `@throws {UserNotFoundError}` が適切に記載
- **M-7 (コメント規約)**: TODO/FIXME コメントなし
- **M-9 (HTML セマンティクス)**: `<main>`, `<table>`, `<thead>`, `<tbody>` 等のセマンティック要素が適切に使用。`<label>` と `for` 属性の関連付けも正しい。SVG に `aria-label` と `<title>` が付与

### [Perf] パフォーマンス

- **P-1 (N+1 問題)**: Repository 実装で単一クエリ取得。UseCase 内ループ内 DB クエリなし
- **P-2 (不要な再レンダリング)**: Qwik の Resumability モデルによりクライアント側再レンダリングリスク低
- **P-3 (リソース管理)**: 手動 try/finally リソース管理パターンなし
- **P-7 (CSS パフォーマンス)**: `!important` の使用なし。CSS Modules によりセレクタ詳細度が低く保たれている
- **PrismaClient キャッシュ**: URL ベースの `Map` キャッシュにより PrismaClient の再生成を防止

### [Type] 型安全性

- **T-1 (`any` 型)**: 一切使用されていない
- **T-2 (非 null アサーション)**: 未使用。Optional chaining と nullish coalescing が適切に使用
- **T-4 (パラメータプロパティ)**: 全クラスでメンバーを明示的に宣言し constructor で代入
- **T-10 (アクセス修飾子)**: 全クラスで `public`/`private`/`readonly` が明示されている

### [Sec] セキュリティ

- **S-4 (ハードコード秘密情報)**: 検出なし。環境変数 (`Env` オブジェクト) 経由で正しく管理
- **S-5 (クライアントバンドル漏洩)**: `.tsx` から `~/container` やサーバー専用ライブラリへの直接 import なし
- **S-7 (インジェクション脆弱性)**: `eval()` / `new Function()` / unsafe raw クエリの使用なし
- **S-8 (XSS リスク)**: `dangerouslySetInnerHTML` / `innerHTML` の使用なし
- **S-9 (環境変数規約違反)**: プロダクションコードに `process.env` なし。`requestEvent.env.get()` の使用もなし

### [Test] テスト品質

- **Q-2 (カバレッジ除外コメント)**: `istanbul ignore` / `c8 ignore` / `v8 ignore` 検出なし
- **Q-3 (AAA パターン)**: 全テストが Arrange-Act-Assert の明確な構造を持つ
- **Q-4 (意図コメント)**: 全テストケース直前に日本語の意図コメントが記述されている
- **Q-7 (外部依存のモック化)**: 全 UseCase テストで Repository が適切にモック化。実際の DB 接続なし
- **Q-8 (モックファクトリパターン)**: `createMockUserRepository` が命名・配置とも規約に準拠
- **Q-9 (フレームワーク固有テスト規約)**: `.server.ts` ハンドラーの直接 import なし
- **Q-13 (構造的デッドテスト)**: `skip` / `xit` / 空ボディテスト検出なし

---

## 統計サマリー

| エージェント    | 分析ファイル数 | Critical | Warning | Suggestion |
| :-------------- | :------------- | :------- | :------ | :--------- |
| Architecture    | 29             | 1        | 2       | 1          |
| Maintainability | 30             | 0        | 2       | 2          |
| Performance     | 29             | 0        | 1       | 2          |
| Type Safety     | 27             | 0        | 1       | 0          |
| Security        | 29             | 2        | 3       | 1          |
| Test Quality    | 16             | 3        | 4       | 2          |
| **合計**        | **-**          | **6**    | **13**  | **8**      |

---

## 次の AI エージェントへの引き継ぎ事項

- **残件数**: Critical: 6 / Warning: 13 / Suggestion: 8
- **自動修正待ち**: 11 件 (`[ ]` + 自動修正可能: はい)
  - A-9 (インラインスタイル), S-1 (email バリデーション), S-1 (id バリデーション), S-1 (エラーハンドリング)
  - Q-1 (RegisterUser モックエコー), Q-1 (GetUsers モックエコー), Q-14 (UserEntity 型のみテスト)
  - M-5 (JSDoc), M-4 (let → IIFE), P-4 (Promise.all 単一要素), Q-5 (Date 共有)
- **手動対応待ち**: 9 件 (`[ ]` + 自動修正可能: いいえ)
  - M-8 (CSS マジックナンバー), T-3 (Prisma ダブルキャスト), A-8 (useContainer 規約乖離)
  - Q-10 (バリデーター・マッパーテスト欠如), Q-10 (Repository 統合テスト)
  - A-6 (規約ドキュメント更新), M-2 (コンポーネント分割), S-8 (CSRF 将来対応), Q-12 (境界値テスト)
- **設計変更必要**: 4 件 (`[-]`)
  - A-8 (container 分割パターン), P-5 (ページネーション), S-3 (認可チェック), S-2 (認証保護)
- **注意点**:
  - Security の Critical 2 件 (バリデーション不足) は最優先で対応すること
  - Test Quality の Critical はビジネス価値のないテストの削除が中心。削除前に必ず意図を確認すること
  - container.ts のファイル分割パターンは設計判断が必要なため、チームで方針を決定してから対応すること
- **最終更新**: 2026-03-05 04:39
