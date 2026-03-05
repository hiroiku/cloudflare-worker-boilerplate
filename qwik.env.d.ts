/// <reference types="vite/client" />

/**
 * CSS Modules の型定義。
 * vite-plugin-typed-css-modules が .d.ts を生成するが、CI の tsc --noEmit では未生成のため
 * 汎用型でフォールバックする。
 */
declare module '*.module.css' {
	const classes: { readonly [key: string]: string };
	export default classes;
}

/**
 * Qwik City の requestEvent.platform の型定義。
 * Cloudflare Pages ミドルウェアが fetch(request, env, ctx) の引数をそのまま渡す。
 */
declare interface QwikCityPlatform {
	readonly env: Env;
	readonly ctx: ExecutionContext;
	readonly request: Request;
}
