import { type RenderOptions, render } from '@builder.io/qwik';
import Root from './infrastructure/ui/root';

/**
 * 開発環境用エントリーポイント。
 * クライアントサイドで Root コンポーネントを DOM に直接レンダリングする。
 */
export default function (opts: RenderOptions): ReturnType<typeof render> {
	return render(document, <Root />, opts);
}
