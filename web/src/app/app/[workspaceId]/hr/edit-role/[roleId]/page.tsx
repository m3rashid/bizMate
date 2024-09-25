import { EditRoleComponent } from '../components/editRole';
import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { getUserPermissionsOnServer, prefetchRoleById } from '@/api/permissions/server';
import { UnAuthorizedPage } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkPermission } from '@/hooks/checkPermission';
import { PERMISSION_UPDATE } from '@/utils/constants';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function EditRole(props: NextjsPageProps<{ workspaceId: string; roleId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	const permissions = await getUserPermissionsOnServer(queryClient, props.params.workspaceId, sessionCookie);
	if (!permissions || permissions.data.length === 0) return <UnAuthorizedPage />;
	if (!checkPermission(permissions.data, { object_type: 'role', level: PERMISSION_UPDATE })) return <UnAuthorizedPage />;

	await prefetchRoleById(queryClient, props.params.workspaceId, props.params.roleId, sessionCookie);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<EditRoleComponent workspaceId={props.params.workspaceId} roleId={props.params.roleId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
