import { createQwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';

/**
 * Cloudflare  Workers 用エントリーポイント。
 * QwikCity ミドルウェアを生成し、エッジでリクエストを処理する。
 */
const fetch: ReturnType<typeof createQwikCity> = createQwikCity({
	qwikCityPlan,
	render,
});

export default { fetch };
