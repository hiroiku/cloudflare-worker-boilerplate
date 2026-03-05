import { component$ } from '@builder.io/qwik';
import styles from './InputField.module.css';

interface InputFieldProps {
	id: string;
	label: string;
	name: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
	autoComplete?: string;
}

/** ラベル付き入力フィールド */
export const InputField = component$<InputFieldProps>(
	({ id, label, name, type = 'text', placeholder, required, autoComplete }) => {
		const inputProps: Record<string, string | boolean> = { id, name, type };
		if (placeholder !== undefined) {
			inputProps.placeholder = placeholder;
		}
		if (required !== undefined) {
			inputProps.required = required;
		}
		if (autoComplete !== undefined) {
			inputProps.autoComplete = autoComplete;
		}

		return (
			<div class={styles.formGroup}>
				<label class={styles.label} for={id}>
					{label}
				</label>
				<input class={styles.input} {...inputProps} />
			</div>
		);
	},
);
