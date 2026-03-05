import { component$, Slot } from '@builder.io/qwik';
import styles from './Card.module.css';

/** コンテンツをホワイトカードで包むコンテナ */
export const Card = component$(() => {
	return (
		<div class={styles.card}>
			<Slot />
		</div>
	);
});
