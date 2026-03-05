import { component$, type QRL, Slot } from '@builder.io/qwik';
import styles from './Button.module.css';

interface ButtonProps {
	type?: 'submit' | 'button' | 'reset';
	onClick$?: QRL<() => void>;
}

/** 汎用ボタン */
export const Button = component$<ButtonProps>(({ type = 'button', onClick$ }) => {
	return (
		<button class={styles.button} onClick$={onClick$} type={type}>
			<Slot />
		</button>
	);
});
