import { existsSync, mkdirSync } from 'node:fs';

/**
 * カバレッジ収集時に .tmp/ ディレクトリを事前作成して ENOENT を防ぐ
 */
export function setup(): void {
	const dir = './reports/coverage/.tmp';
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}
