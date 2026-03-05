# クリーンアーキテクチャ

このプロジェクトは厳密なクリーンアーキテクチャに従う。
依存の方向は常に外側 (Entry → Infrastructure/Interface → Application → Domain) であり、内側から外部フレームワーク/SDK へ依存してはならない。

---

## ディレクトリ構造

```text
/src
├── entry.*.ts                 # 環境別エントリーポイント（Composition Root）
├── entry.*.container.ts       # 環境別 DI Container
├── container.ts               # 共通 DI Container（Service 型合成・useContainer）
├── container.infrastructure.ts  # Infrastructure 層のトークン定義と登録
├── container.interface.ts       # Interface 層のトークン定義と登録
├── container.application.ts     # Application 層のトークン定義と登録
│
├── app-kernel/                # 共通基盤（プロジェクト非依存）
│   ├── errors/                # BaseError、各層のエラー基底クラス
│   └── types/                 # 共通型定義・ユーティリティ型
│
├── domain/                    # Domain
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   ├── events/
│   └── errors/
│
├── application/               # Application
│   ├── use-cases/             # ユースケース
│   ├── ports/                 # Output Port（依存性逆転のための内側インターフェース）
│   │   ├── repositories/
│   │   ├── integrations/
│   │   └── transport/
│   ├── services/
│   ├── events/                # 統合イベント等
│   └── errors/
│
├── interface/                 # Interface Adapters
│   ├── controllers/           # HTTP/GraphQL/CLI等の入力をUseCaseへ
│   ├── presenters/            # UseCaseの出力を外部レスポンスへ
│   ├── validators/            # 入力検証
│   ├── mappers/               # DTO/Request/Response 変換
│   └── errors/
│
└── infrastructure/            # Infrastructure
    ├── repositories/          # 永続化（DB/ORM/Repository実装等）
    ├── integrations/          # 外部接続（外部API/SDK：例 WorkOS / AI / Mastra 等）
    ├── transport/             # 通信手段（HTTPクライアント、リトライ、レート制限、メッセージング等）
    └── errors/
```

サブディレクトリ命名ルール: `application/ports/*` のサブディレクトリ名は、対象となる実装が属する `infrastructure/*` のディレクトリ名と一致させる (`repositories` / `integrations` / `transport`)

---

## ファイル命名規則

`{名前}.{要素タイプ}.ts` の形式で命名する。テストは `*.spec.ts`。

| 層 | 要素 | 命名パターン | 例 |
| --- | --- | --- | --- |
| Domain | Entity | `*.entity.ts` | `user.entity.ts` |
| Domain | Value Object | `*.value-object.ts` | `email.value-object.ts` |
| Domain | Domain Service | `*.service.ts` | `auth.service.ts` |
| Domain | Domain Event | `*.event.ts` | `user-created.event.ts` |
| Domain | Error | `*.error.ts` | `user-not-found.error.ts` |
| Application | Use Case | `*.use-case.ts` | `create-user.use-case.ts` |
| Application | Repository Interface | `*.repository.ts` | `user.repository.ts` |
| Application | Integration Interface | `*.integration.ts` | `auth.integration.ts` |
| Application | Transport Interface | `*.transport.ts` | `event-bus.transport.ts` |
| Application | Application Service | `*.service.ts` | `notification.service.ts` |
| Application | Error | `*.error.ts` | `validation.error.ts` |
| Interface | Controller | `*.controller.ts` | `user.controller.ts` |
| Interface | Presenter | `*.presenter.ts` | `user.presenter.ts` |
| Interface | Validator | `*.validator.ts` | `create-user.validator.ts` |
| Interface | Mapper | `*.mapper.ts` | `user.mapper.ts` |
| Interface | Error | `*.error.ts` | `request.error.ts` |
| Infrastructure | Repository 実装 | `*.repository.ts` | `user.repository.ts` |
| Infrastructure | Integration 実装 (Adapter/Client) | `*.integration.ts` | `workos.integration.ts` |
| Infrastructure | Transport 実装 | `*.transport.ts` | `http.transport.ts` |
| Infrastructure | Error | `*.error.ts` | `database.error.ts` |
| エントリーポイント | 共通 DI Container | `container.ts` | `container.ts` |
| エントリーポイント | 層別 DI Container | `container.{layer}.ts` | `container.infrastructure.ts` |
| エントリーポイント | 環境別 DI Container | `entry.*.container.ts` | `entry.worker.container.ts` |

---

## 層構造と依存関係

| 層 | 責務 | 配置するもの | 依存可能な層 (プロジェクト内) |
| --- | --- | --- | --- |
| app-kernel | 汎用基盤 (プロジェクト非依存) | BaseError、層別 Error 基底、共通型、純粋ユーティリティ | なし |
| Domain | ビジネスルール (不変条件・同一性) | Entity、Value Object、Domain Service、Domain Event、Error | app-kernel のみ |
| Application | ユースケース (手順・取引境界) | Use Case、ports/ (Output Port)、Application Service、統合イベント、Error | Domain、app-kernel |
| Interface | Inbound (入力受付・検証・変換) | Controller、Presenter、Validator、Mapper、Error | Application、Domain、app-kernel |
| Infrastructure | Outbound (外部 I/O・SDK・永続化) | repositories/integrations/transport の具象実装、Error | Interface、Application、Domain、app-kernel |
| エントリーポイント | 起動・DI 組み立て (Composition Root) | `entry.*.ts` / `container.ts` | Infrastructure、Interface |

---

## Entity と Value Object の使い分け

- ID で同一性を持つ → Entity
- 値で同一性が決まる → Value Object

---

## 外部サービス/SDK (integrations) の配置ルール

WorkOS、各種 AI SDK、Mastra 等の外部基盤は `infrastructure/integrations/` に配置する。
`application/ports/integrations/` には目的ベースのインターフェースを定義し、外部 SDK の型・エラー・概念を露出しない。

### 内側へのモデル変換 (コロケート規約)

外部 SDK の型に触れる変換・正規化はその SDK を扱う integration 実装ファイル内にコロケートする。

- 例: 外部レスポンス → `{Name}Output` / ドメインの Value Object
- 例: 外部エラー → `InfrastructureError` (必要なら UseCase で `ApplicationError` へ変換)

---

## 外部ライブラリを Domain / Application で扱う判断基準と条件

### 判断基準 (Domain/Application で直接使ってよい条件)

次の全てを満たす場合、Domain/Application で利用してよい。

1. I/O を伴わない (HTTP/DB/FS/OS など外部依存がない)
2. 環境依存が薄い (設定値やグローバル状態に強く依存しない)
3. 公開 API を汚染しない (UseCase I/O / Port / Domain 公開型にライブラリ固有の型や概念を露出しない)
4. 失敗をドメイン/アプリのエラーに変換できる (例外やエラー構造をそのまま境界外へ出さない)

### uuid / cuid 生成ライブラリ

- 上記判断基準を満たすため、Domain/Application で利用してよい
- 生成結果は自前の Value Object 等で包む (`UserId` 等)
  - 文字列 ID をそのままドメイン全体に広げない
  - 生成戦略を変更しても Domain の表現が崩れないようにする

### zod (スキーマ/バリデーション)

- 原則: Interface (validators) で利用する (入力境界の整形・検証)
- Application で利用する場合は、次を全て満たすこと:
  1. zod の schema や `infer` など zod 由来の型を公開 API にしない (UseCase Input/Output、Port、Domain 公開型に露出しない)
  2. zod のエラー構造を ApplicationError / DomainError / InterfaceError に変換する
  3. Domain の不変条件は Entity/Value Object 側で担保し、zod に丸投げしない

---

## Entity の実装規約

### クラス命名

`{名前}Entity` (例: `UserEntity`)

### IEntity<T> の実装義務

すべての Entity クラスは `app-kernel/types/entity.ts` が提供する `IEntity<T>` 型を実装しなければならない。`T` にはスナップショット型 `I{Name}Entity` を指定する。

- `IEntity<T>` は `Readonly<T> & { serialize(): T }` として定義されている
- `serialize()` は Entity の全プロパティをプレーンオブジェクトとして返す
- シリアライズ境界越えでは `entity.serialize()` を使用し、手動のフィールドマッピングを行わない

### スナップショット型 (境界越え用)

プレーンオブジェクト型は `I{Name}Entity` としてエンティティファイル内に co-locate して export する。

```ts
import type { IEntity } from '~/app-kernel/types/entity';

export interface IUserEntity {
	readonly id: string;
	readonly createdAt: Date;
}

export class UserEntity implements IEntity<IUserEntity> {
	public readonly id: string;
	public readonly createdAt: Date;

	public constructor(entity: IUserEntity) {
		// 不変条件チェック（不正ならDomainError）
		this.id = entity.id;
		this.createdAt = entity.createdAt;
	}

	public serialize(): IUserEntity {
		return {
			id: this.id,
			createdAt: this.createdAt,
		};
	}
}
```

### 型の使い分け

| コンテキスト | 使う型 |
| --- | --- |
| 内部 (UseCase/Domain ロジック) | `{Name}Entity` |
| シリアライズ境界越え (API レスポンス等) | `I{Name}Entity` |
| Entity → プレーンオブジェクト変換 | `entity.serialize()` |

---

## DI Container の構成パターン

### 層別分割パターン

DI Container はレイヤー単位のファイルに分割してよい。各ファイルはそのレイヤーのトークン型マップ (`{Layer}Service`) と登録関数 (`build{Layer}Container`) をエクスポートする。

- `container.infrastructure.ts` — Infrastructure 層のトークンと登録
- `container.interface.ts` — Interface 層のトークンと登録
- `container.application.ts` — Application 層のトークンと登録
- `container.ts` — 全層の `Service` 型を合成し、`buildContainer` / `useContainer` を提供する

### 登録順序

`buildContainer` 内の登録順序は Infrastructure → Interface → Application とする。可読性のためレイヤー順を維持する。

### 型エイリアス

`AppContainer` 型エイリアスで `ReturnType<typeof buildContainer>` を参照する。非同期の buildContainer の場合は `Awaited<ReturnType<typeof buildContainer>>`。

### Output Port の型

Output Port (Repository, Gateway 等) の値型にはインターフェース型を使用する。UseCase 等の交換不要なサービスは具象クラスを直接使用してよい。

### インフラクライアントの扱い

DB クライアント、外部 API クライアント等のインフラクライアントは `buildContainer` 内のローカル変数として生成し、ファクトリに直接渡す。`Service` 型マップには登録しない。

### useContainer の非同期キャッシュパターン

`useContainer` は非同期関数 (Infrastructure 層のコンテナ構築に動的 import が必要な場合等) になりうるため、`cachedContainer ??=` の代わりに以下のパターンを使用する。

```ts
let cachedContainer: AppContainer | undefined;

export async function useContainer(env: Env): Promise<AppContainer> {
  if (cachedContainer === undefined) {
    cachedContainer = await buildContainer(env);
  }
  return cachedContainer;
}
```

---

## 入出力型の co-locate

UseCase の入出力型 (Input/Output) は UseCase ファイル内に co-locate して export する。
命名は `{名前}Input` / `{名前}Output`。

---

## app-kernel の制約

app-kernel は「どのプロジェクトでも再利用可能な汎用基盤」である。

### MUST NOT

- app-kernel にプロジェクト固有のビジネスロジックを配置しない
  理由: app-kernel が特定プロジェクトに結合し、再利用不能になる
- app-kernel にプロジェクト固有の DI トークン / シンボルを配置しない
  理由: DI トークンはプロジェクトの構成に依存するため、汎用基盤に含めない
- app-kernel にプロジェクト固有の設定 / 定数を配置しない
  理由: 設定は環境やプロジェクトに依存するため、汎用基盤に含めない
- app-kernel から特定ドメインや特定ベンダ SDK に依存しない
  理由: app-kernel は全層の下位に位置するため、上位の層やベンダに依存すると循環が発生する

---

## エラークラス階層

各層のエラーは `app-kernel/errors/` に配置された層別基底クラスを継承する。

```text
BaseError (app-kernel)
├── DomainError         → Domainのエラー基底
├── ApplicationError    → Applicationのエラー基底
├── InterfaceError      → Interfaceのエラー基底
└── InfrastructureError → Infrastructureのエラー基底
```

---

## 制約

### MUST NOT

- 内側 (Domain/Application) から外側 (Infrastructure/SDK/Framework) へ import しない
  理由: 依存方向が逆転するとテスタビリティが失われ、フレームワーク変更がビジネスロジックに波及する
  代わりに: Port インターフェースを Application 層に定義し、Infrastructure 層で実装する

- UseCase が Port を介さず直接 DB/HTTP/SDK を呼び出さない
  理由: UseCase がインフラ詳細に直接依存すると、モックが困難になりテスト不能になる
  代わりに: Repository/Integration/Transport インターフェースを Port として定義し、DI で注入する

- 循環参照を作らない
  理由: ビルド時にデッドロックや不定な初期化順序が発生する

- 内側の層が具象クラスに直接依存しない
  理由: 具象への依存は交換不能になり、テスト時のモック注入を阻害する
  代わりに: Port (interface) を定義し、具象は DI で注入する

- 外部 SDK/フレームワークの型を内側 API に漏らさない (UseCase I/O / Port / Domain 公開型)
  理由: 外部ライブラリの変更が内側のビジネスロジックに波及する
  代わりに: integration 実装ファイル内でドメイン型に変換する

- UI/HTTP フレームワークの概念を Domain/Application に混入しない
  理由: フレームワーク変更時にビジネスロジックの書き直しが必要になる

- app-kernel から 4 層 (Domain/Application/Interface/Infrastructure) へ依存しない
  理由: app-kernel は全層の基盤であり、上位依存は循環を引き起こす

- DI コンテナへのサービス登録を `buildContainer` の外で行わない
  理由: DI 登録が散在するとコンテナの全体像が把握できなくなり、初期化順序の問題を引き起こす
  代わりに: `buildContainer` 関数内で全て登録する

- `Service` 型マップにインフラクライアントを登録しない (DB クライアント、外部 API クライアント等)
  理由: インフラクライアントは DI トークンとして公開する必要がなく、ファクトリ内で直接使用すればよい
  代わりに: `buildContainer` 内のローカル変数として生成し、ファクトリに直接渡す
