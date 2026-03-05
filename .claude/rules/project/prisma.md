# Prisma

## ディレクトリ配置

`src/infrastructure/database/prisma/` に配置:

- `schema.prisma` - スキーマ定義
- `migrations/` - マイグレーションファイル
- `generated/` - 自動生成された Client

プロジェクトルートに `prisma.config.ts` を配置し、スキーマ・マイグレーション・生成先のパスを設定する。

ER 図は `docs/ERD.md` に prisma-markdown で自動生成する。

---

## SQL

- TypedSQL によるカスタムクエリを使用し、パラメーターに型を付与する

---

## 環境変数

- `DATABASE_URL` - 接続 URL。プロトコルに応じて接続方式を自動切り替えする
  - `prisma://` - Prisma Accelerate 経由 (HTTP ベース接続プーリング + グローバルキャッシュ。本番/ステージング用)
  - `postgresql://` - ローカル PostgreSQL 直接接続 (オフライン開発用)
- `DIRECT_DATABASE_URL` - マイグレーション用直接接続 URL

### クライアント統一

`@prisma/client` から import する。環境ごとのエンジン切り替えは Prisma が自動で行うため、`@prisma/client/edge` は使用しない。

---

## モデル定義規約

### 命名規則

- `@@map()` でスネークケースのテーブル名を指定する
- `@map()` でスネークケースのカラム名を指定する
- ID は `cuid()` を使用する

### @namespace (ERD)

- `model` には `@namespace {機能名}` と `@namespace Overview` の 2 行を付与する
- `enum` には `@namespace {機能名}` のみ付与する (Overview 不要)
- prisma-markdown が Overview セクションに全 model を集約し、ERD の全体像を生成する

---

## 制約

### MUST NOT

- `schema.prisma` に接続 URL を直書きしない
  理由: シークレット情報がリポジトリに漏洩し、環境ごとの切り替えができなくなる
  代わりに: 環境変数 (`DATABASE_URL`) で管理する

- `generated/` 配下を手動編集しない
  理由: `prisma generate` で上書きされるため、手動変更は失われる

- ポリモーフィックなテーブル設計を使用しない (`type` カラムによる STI、`referenceId` + `targetType` による汎用参照など)
  理由: 外部キー制約が効かず、データの整合性を DB レベルで担保できない
  代わりに: 概念が異なるものは別テーブルに分離し、外部キー制約でデータの整合性を担保する
