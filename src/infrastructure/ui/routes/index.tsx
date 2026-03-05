import { component$ } from '@builder.io/qwik';
import {
	type DocumentHead,
	Form,
	type RequestEventAction,
	type RequestEventLoader,
	routeAction$,
	routeLoader$,
	zod$,
} from '@builder.io/qwik-city';
import { Badge } from '../components/primitives/badge/Badge';
import { Button } from '../components/primitives/button/Button';
import { Card } from '../components/primitives/card/Card';
import { InputField } from '../components/primitives/input-field/InputField';
import { SuccessMessage } from '../components/primitives/success-message/SuccessMessage';
import styles from './index.module.css';
import { deleteUserHandler, getUsersHandler, registerUserHandler } from './index.server';

/** deleteUserHandler のラッパー。テストから直接呼び出し可能。 */
export async function handleDeleteUser(data: { id: string }, requestEvent: RequestEventAction) {
	return deleteUserHandler(data, requestEvent);
}

/** ユーザー削除アクション */
// zod$ のコールバック形式で qwik-city 内蔵の Zod v3 インスタンスを使用することで Zod v4 との非互換を回避する
export const useDeleteUser = routeAction$(
	handleDeleteUser,
	zod$(z => z.object({ id: z.string().min(1) })),
);

/** registerUserHandler のラッパー。テストから直接呼び出し可能。 */
export async function handleRegisterUser(data: { email: string }, requestEvent: RequestEventAction) {
	return registerUserHandler(data, requestEvent);
}

/** ユーザー登録アクション */
// zod$ のコールバック形式で qwik-city 内蔵の Zod v3 インスタンスを使用することで Zod v4 との非互換を回避する
export const useRegisterUser = routeAction$(
	handleRegisterUser,
	zod$(z => z.object({ email: z.string().email() })),
);

/** getUsersHandler のラッパー。テストから直接呼び出し可能。 */
export async function loadUsers(requestEvent: RequestEventLoader) {
	return getUsersHandler(requestEvent);
}

/** ユーザー一覧ローダー */
export const useUsers = routeLoader$(loadUsers);

/**
 * トップページ: ユーザー登録フォーム + ユーザー一覧テーブル
 */
export default component$(() => {
	const action = useRegisterUser();
	const deleteAction = useDeleteUser();
	const loader = useUsers();
	const users = loader.value.users;

	return (
		<main class={styles.container}>
			<header class={styles.header}>
				<h1 class={styles.title}>Welcome</h1>
				<p class={styles.subtitle}>Minimal Cloudflare Worker Boilerplate</p>
			</header>

			<Card>
				<Form action={action}>
					<InputField
						autoComplete="email"
						id="email"
						label="Email Address"
						name="email"
						placeholder="you@example.com"
						required
						type="email"
					/>
					<Button type="submit">Register</Button>
				</Form>

				{action.value && 'user' in action.value && (
					<div style={{ marginTop: '1.5rem' }}>
						<SuccessMessage>Registered successfully: {action.value.user.email}</SuccessMessage>
					</div>
				)}
			</Card>

			<Card>
				<h2 class={styles.sectionTitle}>
					Registered Users
					<Badge>{users.length}</Badge>
				</h2>

				{(() => {
					if (users.length > 0) {
						return (
							<div class={styles.tableWrapper}>
								<table class={styles.table}>
									<thead>
										<tr>
											<th class={styles.th}>Email</th>
											<th class={styles.th}>Created At</th>
											<th class={styles.th}>Actions</th>
										</tr>
									</thead>
									<tbody>
										{users.map(user => (
											<tr class={styles.tr} key={user.id}>
												<td class={styles.td}>{user.email}</td>
												<td class={styles.td}>
													{new Date(user.createdAt).toLocaleDateString('en-US', {
														day: 'numeric',
														hour: '2-digit',
														minute: '2-digit',
														month: 'short',
														year: 'numeric',
													})}
												</td>
												<td class={styles.td}>
													<Form action={deleteAction}>
														<input name="id" type="hidden" value={user.id} />
														<button class={styles.deleteButton} type="submit">
															Delete
														</button>
													</Form>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						);
					}

					return (
						<div class={styles.emptyState}>
							<p>No users registered yet. Be the first!</p>
						</div>
					);
				})()}
			</Card>
		</main>
	);
});

/** トップページの meta 情報と title を定義する。 */
export const head: DocumentHead = {
	meta: [
		{
			content: 'A minimal, smart, and exciting boilerplate for Cloudflare Workers.',
			name: 'description',
		},
	],
	title: 'Cloudflare Worker Boilerplate',
};
