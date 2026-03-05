import { component$, Slot } from '@builder.io/qwik';
import styles from './SuccessMessage.module.css';

/** 成功フィードバックをチェックアイコン付きで表示するメッセージ */
export const SuccessMessage = component$(() => {
	return (
		<div class={styles.successMessage}>
			<svg
				aria-label="Success"
				fill="none"
				height="20"
				role="img"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				width="20"
			>
				<title>Success</title>
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
			<span>
				<Slot />
			</span>
		</div>
	);
});
