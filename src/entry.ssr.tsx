import { type RenderToStreamOptions, renderToStream } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './infrastructure/ui/root';

/**
 * SSR 用エントリーポイント。
 * Root コンポーネントをストリームとしてレンダリングする。
 */
export default function (opts: RenderToStreamOptions): ReturnType<typeof renderToStream> {
	return renderToStream(<Root />, {
		manifest,
		...opts,
		containerAttributes: {
			lang: 'ja',
			...opts.containerAttributes,
		},
	});
}
