import { describe, expect, it } from 'bun:test';
import worker from '../src/worker.entry';

/**
 * テスト用の {@link ExecutionContext} モックを生成する。
 * `exports` / `props` など実行時にのみ必要なプロパティは省略している。
 * @returns モック化された ExecutionContext
 */
function createExecutionContext(): ExecutionContext {
	return {
		waitUntil: () => {
			// noop
		},
		passThroughOnException: () => {
			// noop
		},
	} as unknown as ExecutionContext;
}

describe('Hello World worker', () => {
	it('responds with Hello World!', async () => {
		const request = new Request('http://example.com');
		const env: Env = {};
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		expect(await response.text()).toBe('Hello World!');
	});
});
