import { component$, Slot } from '@builder.io/qwik';
import styles from './Badge.module.css';

/** 数値・ラベルを丸みのあるピルで表示するバッジ */
export const Badge = component$(() => {
	return (
		<span class={styles.badge}>
			<Slot />
		</span>
	);
});
