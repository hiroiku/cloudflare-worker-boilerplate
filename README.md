# Cloudflare Worker Boilerplate

Cloudflare Workers プロジェクトのボイラープレート。クリーンアーキテクチャに基づいた構成で、TypeScript / Bun / Biome を採用しています。

## 技術スタック

| カテゴリー             | ツール                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| ランタイム             | [Cloudflare Workers](https://developers.cloudflare.com/workers/) |
| 言語                   | [TypeScript](https://www.typescriptlang.org/) 5.x                |
| パッケージマネージャー | [Bun](https://bun.sh/) (必須)                                    |
| Linter / Formatter     | [Biome](https://biomejs.dev/)                                    |
| テスト                 | [bun:test](https://bun.sh/docs/cli/test)                         |
| デプロイ               | [Wrangler](https://developers.cloudflare.com/workers/wrangler/)  |

## 必要条件

- [Bun](https://bun.sh/) >= 1.0.0
- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up)

## セットアップ

```bash
# 依存関係のインストール (Bun が必須です)
bun install
```

## 開発コマンド

```bash
# ローカル開発サーバーの起動
bun run dev

# テストの実行
bun test

# 型チェック
bun run typecheck

# Lint
bun run lint

# Lint + フォーマット (自動修正)
bun run lint:format

# Cloudflare Workers の型定義を生成
bun run cf-typegen

# デプロイ
bun run deploy
```

## License

UNLICENSED
