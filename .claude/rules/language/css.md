---
paths: ['*.css']
---

# CSS 規約

---

## セレクタ

### MUST NOT

- ID セレクタ (`#id`) をスタイリングに使用しない
  理由: 詳細度が高すぎてオーバーライドが困難になる。JavaScript のフックにのみ使用する

### SHOULD

- ユニバーサルセレクタ (`*`) の使用は避ける
- 要素セレクタよりクラスセレクタを優先する

## 命名規約

### MUST

- クラス名は kebab-case を使用する
- 意味のある命名をし、見た目ではなく役割を表す (`red-text` ではなく `error-message`)

### SHOULD

- BEM (Block Element Modifier) 記法を推奨する

## ネスティング

### MUST

- ネストは最大 3 階層まで
  理由: 深いネストはセレクタの詳細度を不必要に上げ、保守性を損なう

- `&` セレクタは BEM の Element/Modifier に使用する

  ```css
  .block {
  	&__element {
  		color: red;
  	}

  	&--modifier {
  		color: blue;
  	}
  }
  ```

- `@media` はブロック (セレクタ) 内にネストする (コンポーネントのスタイルを一箇所にまとめる)

  ```css
  .block {
  	width: 100%;

  	@media (min-width: 768px) {
  		width: 50%;
  	}
  }
  ```

## カスタムプロパティ (変数)

### MUST

- 変数名は `--kebab-case` を使用する
- グローバル変数は `:root` で管理する
- マジックナンバーをカスタムプロパティに抽出する

  ```css
  :root {
  	--color-primary: #3366ff;
  	--spacing-base: 8px;
  	--header-height: 64px;
  }
  ```

## プロパティ

### MUST

- プロパティはアルファベット順または論理的なグループ順で記述する
- `0` の単位は省略する (`0px` ではなく `0`)
- 色は小文字の 16 進数または CSS 変数を使用する

### SHOULD

- ショートハンドプロパティを適切に使用する

## フォーマット

### MUST

- インデントは 2 スペース
- セレクタと `{` の間にスペースを入れる
- プロパティの `:` の後にスペースを入れる
- 各プロパティは別の行に記述する

## ファイル構成

### MUST

- 機能ごとにファイルを分割する

## パフォーマンス

### SHOULD

- `!important` の使用は避ける
  理由: スタイルのオーバーライドチェーンが崩壊し、保守が困難になる
- 過度に詳細なセレクタを避ける
- 未使用の CSS を削除する

## ブラウザサポートポリシー

### 対象ブラウザ

- Browserslist クエリ `last 2 versions` に該当するブラウザを対象とする
- 対象ブラウザの判定は `.browserslistrc` で一元管理する
- 機能の対応状況は https://web.dev/baseline を基準とする

### MUST

- Baseline「Widely Available」の CSS 機能はベンダープレフィクスやフォールバックなしで使用する
- Baseline「Newly Available」の CSS 機能は `@supports` によるフォールバックを併記する
- 上記いずれにも該当しない機能はフォールバックなしで使用しない

## モダン CSS の活用方針

### MUST

- 実装時点で Baseline 対応済みの CSS 機能が存在する場合、JavaScript や従来のハックより CSS による実装を優先する
- 同じ目的を果たす手段が複数ある場合、以下の優先順位で選択する
  1. Baseline「Widely Available」の CSS 機能
  2. Baseline「Newly Available」の CSS 機能（`@supports` フォールバック併記）
  3. JavaScript による実装

### SHOULD

- Baseline 対応済みの機能を見落とさないよう、実装前に https://web.dev/baseline で利用可能な機能を確認する
- 「Newly Available」であることを理由に採用を避けない。全コアブラウザで対応済みであれば、フォールバック付きで積極的に採用する

### MUST NOT

- Baseline 対応済みの CSS 機能で実現可能な表現に JavaScript を使用しない
- Baseline 対応済みの CSS 機能で置き換えられる従来の手法やハック（プリプロセッサ依存の関数、非標準ベンダープレフィクス、座標の手動計算等）を使用しない
