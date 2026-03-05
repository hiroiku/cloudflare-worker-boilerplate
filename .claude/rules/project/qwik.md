# Qwik

## CSS Modules

コンポーネントのスタイリングには CSS Modules を使用する。

- `*.module.css` ファイルをコンポーネントと同じディレクトリに配置する
- ファイル名はコンポーネントのファイル名に合わせる (例: `layout.tsx` → `layout.module.css`)
- `*.module.css.d.ts` は `vite-plugin-typed-css-modules` が自動生成する
- CSS 側のクラス名は kebab-case を使用する

---

## 環境変数

- `requestEvent.platform.env` 経由で環境変数を取得する
- `qwik.env.d.ts` に `QwikCityPlatform` の宣言を記述する。環境変数型は `wrangler types` が自動生成する

---

## DI Container

ルートハンドラーで DI Container が必要な場合は `await useContainer(requestEvent.platform.env)` を呼ぶ。

---

## クライアント/サーバーコード分離

サーバー専用ライブラリを `.tsx` から直接 import するとビルドエラーになるため、サーバーロジックは `.server.ts` に分離する。

### ファイル構成

```text
routes/some-page/
├── index.tsx          # コンポーネント + routeLoader$/routeAction$ 定義 + ラッパー関数
├── index.server.ts    # サーバーロジック (DI Container, UseCase 呼び出し等)
└── index.module.css   # スタイル
```

### ラッパー関数の命名規則

`.tsx` では `.server.ts` のハンドラーを静的 import し、`routeLoader$` / `routeAction$` に渡すラッパー関数を定義する。ラッパーは export し、テストから直接呼び出せるようにする。

| ハンドラー種別 | `.tsx` ラッパー名 | `.server.ts` ハンドラー名 |
| -------------- | ----------------- | ------------------------- |
| `routeLoader$` | `load{Name}`      | `{name}Handler`           |
| `routeAction$` | `handle{Name}`    | `{name}Handler`           |
| `onRequest`    | `guard{Name}`     | `{name}GuardHandler`      |

### サーバー専用ルート (`.ts`)

`onGet` / `onRequest` のみを export するルートファイル (認証コールバック等) は `.ts` 拡張子で十分。`.server.ts` 分離は不要。

---

## シリアライズ境界

シリアライズ境界越え (`routeLoader$` → コンポーネント、API レスポンス等) では `I{名前}Entity` を使用する。

`routeLoader$` の戻り値やコンポーネントの props にはクラスインスタンスではなくプレーンオブジェクト型 (`I{名前}Entity`) を使用する。JSON シリアライズでメソッドが失われるため。

---

## フォームバリデーション

`routeAction$` のバリデーションには `zod$` を使用する。Interface/validators ファイルは作成しない。

```typescript
// zod$ のコールバック形式で qwik-city 内蔵の Zod インスタンスを使用する
export const useCreateFoo = routeAction$(
	handleCreateFoo,
	zod$(z => z.object({ name: z.string().min(1) })),
);
```

---

## 制約

### MUST NOT

- `*.module.css.d.ts` を手動編集しない
  理由: `vite-plugin-typed-css-modules` が自動生成するファイルであり、手動変更は上書きで失われる

- グローバル CSS でコンポーネント固有のスタイルを定義しない
  理由: グローバル CSS はスコープがないため、意図しないスタイル衝突が発生する
  代わりに: CSS Modules でコンポーネントにスコープを限定する

- インラインスタイル (`style` 属性) を使用しない (CSS カスタムプロパティの注入および動的な数値バインディングを除く)
  理由: スタイルの一元管理ができず、CSS Modules の利点が失われる

- `requestEvent.env.get()` で環境変数にアクセスしない
  理由: `EnvGetter` は全ての値が `string | undefined` になり型安全性が失われる
  代わりに: `requestEvent.platform.env` 経由でアクセスする

- `.tsx` ファイルからサーバー専用ライブラリへ静的 import しない
  理由: Vite がクライアントバンドルに含めようとしてビルドエラーになる
  代わりに: `.server.ts` にサーバーロジックを分離する

- `.tsx` ファイルから `~/container` を静的 import しない
  理由: container は Infrastructure 層への依存を含み、クライアントバンドルに含められない
  代わりに: `.server.ts` 経由で間接的に使用する

- テストで `.server.ts` のハンドラーを直接 import しない
  理由: ラッパー関数を経由しないと、実際のルート定義とテストのインターフェースが乖離する
  代わりに: `.tsx` が export するラッパー関数 (`loadXxx` / `handleXxx`) を使用する

- `zod$` に外部 import した `z` インスタンスを直接渡さない
  理由: Qwik City 内蔵の Zod v3 と `import { z } from 'zod'` (Zod v4) は非互換のためランタイムエラーになる
  代わりに: `zod$(z => ...)` のコールバック形式を使う

- `routeAction$` のバリデーションのために Interface/validators ファイルを作成しない
  理由: `zod$` コールバックがスキーマを管理するため、別途 validators ファイルを作ると二重管理になる
  代わりに: `zod$` コールバック形式を使う
