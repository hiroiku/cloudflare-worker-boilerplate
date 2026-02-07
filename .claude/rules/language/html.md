---
paths: ['*.html', '*.htm']
---

## セマンティック HTML

- 意味のある HTML 要素を使用する（`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` など）
- `<div>` や `<span>` の乱用を避け、適切なセマンティック要素を選択する

## アクセシビリティ

- `<img>` には必ず `alt` 属性を付与する
- フォーム要素には `<label>` を関連付ける
- ランドマーク要素を適切に使用する
- 適切な見出し階層（h1-h6）を維持する

## WAI-ARIA

- セマンティック要素で表現できない場合のみ ARIA ロールを使用する
- `role` 属性はネイティブセマンティクスを上書きしないよう注意する
- `aria-label`, `aria-labelledby`, `aria-describedby` でアクセシブルな名前を提供する
- 動的コンテンツには `aria-live` リージョンを使用する
- インタラクティブ要素には適切な `aria-expanded`, `aria-selected`, `aria-checked` を設定する

## 属性

- Boolean 属性は値を省略する（`disabled="disabled"` を書かない）
- 属性値はダブルクォートで囲む
- `id` 属性はページ内で一意にする

## 構造

- DOCTYPE 宣言を必ず含める（`<!DOCTYPE html>`）
- `<html>` に `lang` 属性を指定する
- `<head>` に `<meta charset="utf-8">` を含める（小文字で記述）
- `<meta name="viewport">` を含める

## フォーマット

- インデントは 2 スペース
- 自己終了タグには `/` を明示的につける（`<br />`, `<img />`, `<input />` など）

## パフォーマンス

- CSS は `<head>` 内で読み込み、JavaScript は `</body>` 直前または `defer` 属性を使用する
- 画像には `width` と `height` 属性を指定し、レイアウトシフトを防ぐ
- 遅延読み込みが適切な画像には `loading="lazy"` を使用する
- クリティカルでないリソースには `rel="preload"` や `rel="prefetch"` を検討する
- インライン CSS/JS は最小限にし、外部ファイルを優先する
