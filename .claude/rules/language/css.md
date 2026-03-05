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

## ファイル構成

### MUST

- 機能ごとにファイルを分割する

## パフォーマンス

### SHOULD

- `!important` の使用は避ける
  理由: スタイルのオーバーライドチェーンが崩壊し、保守が困難になる
- 過度に詳細なセレクタを避ける
- 未使用の CSS を削除する
