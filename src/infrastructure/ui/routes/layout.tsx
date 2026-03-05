import { component$, Slot } from '@builder.io/qwik';

/**
 * 全ルート共通のレイアウト
 */
export default component$(() => {
	return <Slot />;
});
