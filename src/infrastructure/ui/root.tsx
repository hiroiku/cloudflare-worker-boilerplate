import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import './root.css';

/**
 * アプリケーションのルートコンポーネント。
 * QwikCityProvider でルーティング基盤を提供し、head と body の構造を定義する。
 */
export default component$(() => {
	return (
		<QwikCityProvider>
			<head>
				<meta charset="utf-8" />
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
				<title>Cloudflare Worker Boilerplate</title>
			</head>

			<body>
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	);
});
