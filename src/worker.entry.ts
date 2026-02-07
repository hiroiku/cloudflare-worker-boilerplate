/**
 * Cloudflare Workers のメインハンドラー
 */
export default {
	/**
	 * HTTP リクエストを処理する
	 * @param _request 受信した HTTP リクエスト
	 * @param _env Workers バインディング環境変数
	 * @param _ctx 実行コンテキスト
	 * @returns レスポンス
	 */
	async fetch(_request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
