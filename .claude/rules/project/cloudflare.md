# Cloudflare Workers

## 環境変数

Cloudflare Workers の `fetch(request, env, ctx)` が受け取る `Env` を使用する。

### 型定義

- `worker-configuration.d.ts`: `wrangler types` で自動生成される。`wrangler.jsonc` の `vars` と `.env` のシークレットが `Cloudflare.Env` に反映される

### 変数の配置基準

| 種別                       | 配置先                                           | 型生成                  |
| -------------------------- | ------------------------------------------------ | ----------------------- |
| 公開値 (Client ID, URL 等) | `wrangler.jsonc` の `vars`                       | `wrangler types` で自動 |
| シークレット (API Key 等)  | `.env` (ローカル) / `wrangler secret put` (本番) | `wrangler types` で自動 |

---

## 制約

### MUST NOT

- `process.env` で環境変数にアクセスしない
  理由: Cloudflare Workers ランタイムには `process` オブジェクトが存在せず、実行時エラーになる
  代わりに: `Env` オブジェクト経由でアクセスする

- `worker-configuration.d.ts` を手動編集しない
  理由: `wrangler types` が自動生成するファイルであり、手動変更は上書きで失われる
  代わりに: `wrangler.jsonc` の `vars` や `.env` を編集し、`wrangler types` で再生成する
