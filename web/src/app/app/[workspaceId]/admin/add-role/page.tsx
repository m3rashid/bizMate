import { AddEditRole } from '../components/addEditRole';
import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { getUserPermissionsOnServer } from '@/api/permissions/server';
import { UnAuthorizedPage } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkPermission } from '@/hooks/checkPermission';
import { PERMISSION_CREATE } from '@/utils/constants';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function AddRole(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	const permissions = await getUserPermissionsOnServer(queryClient, props.params.workspaceId, sessionCookie);
	if (!permissions || permissions.data.length === 0) return <UnAuthorizedPage />;
	if (!checkPermission(permissions.data, { object_type: 'role', level: PERMISSION_CREATE })) return <UnAuthorizedPage />;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<div className='mb-8'>
					<h1 className='text-2xl font-semibold leading-6 text-gray-900'>Add Role</h1>
					<p className='mt-2 text-sm text-gray-700'>Add a new role for this workspace</p>
				</div>

				<AddEditRole workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
