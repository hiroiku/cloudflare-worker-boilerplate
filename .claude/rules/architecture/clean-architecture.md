# クリーンアーキテクチャ

このプロジェクトは厳密なクリーンアーキテクチャに従います。

---

## ディレクトリ構造

```
/src
├── *.entry.ts          # 環境別エントリーポイント
├── *.container.ts      # 環境別 DI Container
│
├── app-kernel/              # 共通基盤（4層の外側）
│   ├── errors/              # BaseError、各層のエラー基底クラス
│   └── types/               # 共通型定義
│
├── domain/                  # ドメインレイヤー
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   ├── repositories/        # Interface
│   ├── events/
│   └── errors/
│
├── application/             # アプリケーションレイヤー
│   ├── use-cases/
│   ├── services/
│   ├── dto/
│   ├── events/
│   └── errors/
│
├── interface/               # インターフェースレイヤー
│   ├── controllers/
│   ├── presenters/
│   └── gateways/
│
└── infrastructure/          # インフラストラクチャレイヤー
    ├── repositories/        # 実装
    ├── external-api/
    ├── database/
    ├── http/
    └── ui/
```

---

## ファイル命名規則

`{名前}.{要素タイプ}.ts` の形式で命名する。テストは `*.test.ts` を付与。

| 層             | 要素                 | 命名パターン        | 例                        |
| -------------- | -------------------- | ------------------- | ------------------------- |
| Domain         | Entity               | `*.entity.ts`       | `user.entity.ts`          |
| Domain         | Value Object         | `*.value-object.ts` | `email.value-object.ts`   |
| Domain         | Domain Service       | `*.service.ts`      | `auth.service.ts`         |
| Domain         | Repository Interface | `*.repository.ts`   | `user.repository.ts`      |
| Domain         | Domain Event         | `*.event.ts`        | `user-created.event.ts`   |
| Domain         | Error                | `*.error.ts`        | `user-not-found.error.ts` |
| Application    | Use Case             | `*.use-case.ts`     | `create-user.use-case.ts` |
| Application    | Application Service  | `*.service.ts`      | `notification.service.ts` |
| Application    | DTO                  | `*.dto.ts`          | `create-user.dto.ts`      |
| Application    | Error                | `*.error.ts`        | `validation.error.ts`     |
| Interface      | Controller           | `*.controller.ts`   | `user.controller.ts`      |
| Interface      | Presenter            | `*.presenter.ts`    | `user.presenter.ts`       |
| Interface      | Gateway              | `*.gateway.ts`      | `payment.gateway.ts`      |
| Interface      | Error                | `*.error.ts`        | `request.error.ts`        |
| Infrastructure | Repository 実装      | `*.repository.ts`   | `user.repository.ts`      |
| Infrastructure | Error                | `*.error.ts`        | `database.error.ts`       |

---

## 層構造と依存関係

| 層                 | 責務                               | 配置するもの                                                             | 依存可能な層                    |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------ | ------------------------------- |
| app-kernel         | 汎用基盤（プロジェクト非依存）     | BaseError、各層エラー基底クラス、共通型定義、ユーティリティ型            | なし                            |
| Domain             | ビジネスルール、ドメインロジック   | Entity、Value Object、Domain Service、Repository Interface、Event、Error | app-kernel のみ                 |
| Application        | ユースケース、オーケストレーション | Use Case、Application Service、DTO、Event、Error                         | Domain、app-kernel              |
| Interface          | 外部 API、データ変換               | Controller、Presenter、Gateway Interface、Error                          | Application、Domain、app-kernel |
| Infrastructure     | 技術的実装、外部サービス           | Repository 実装、External API、Database、HTTP、UI コンポーネント、Error  | すべての層                      |
| エントリーポイント | 起動、DI Container 設定            | `{環境}.entry.ts`、`{環境}.container.ts`                                 | Infrastructure、app-kernel      |

**Entity と Value Object の使い分け:** ID で識別するものは Entity、値で識別するものは Value Object

---

## app-kernel の制約

app-kernel は「どのプロジェクトでも再利用可能な汎用基盤」である。

**配置禁止:**

- プロジェクト固有のビジネスロジック
- プロジェクト固有の DI トークン / シンボル
- プロジェクト固有の設定 / 定数
- 特定のドメインに依存するコード

---

## エラークラス階層

各層のエラーは `app-kernel/errors/` に配置された層別基底クラスを継承する。

```
BaseError (app-kernel)
├── DomainError         → ドメインレイヤーのエラー基底
├── ApplicationError    → アプリケーションレイヤーのエラー基底
├── InterfaceError      → インターフェースレイヤーのエラー基底
└── InfrastructureError → インフラストラクチャレイヤーのエラー基底
```

各層の `errors/` ディレクトリには、層別基底クラスを継承した具体的なエラーを配置する。

---

## 依存性注入 (DI)

- abstract class のみ `Token` プロパティを持つ (cross-layer 依存用)
- concrete class はクラス自体を DI トークンとして使用
- DI Container 設定は `*.container.ts` に配置

---

## 厳格な禁止事項

1. 内側から外側への依存禁止
2. 層をスキップした依存禁止
3. 循環参照禁止
4. 具象クラスへの直接依存禁止
5. UI フレームワークの ドメインレイヤー/アプリケーションレイヤー への混入禁止
6. app-kernel から 4 層への依存禁止
