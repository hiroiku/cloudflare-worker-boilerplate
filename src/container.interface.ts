import { createContainer } from 'katagami';
import type { ApplicationService } from '~/container.application';
import type { InfrastructureService } from '~/container.infrastructure';

/** Interface 層のトークン型マップ */
export interface InterfaceService {}

/** Interface 層のサービスを登録したコンテナを構築する */
export function buildInterfaceContainer() {
	return createContainer<InfrastructureService & ApplicationService & InterfaceService>();
}
