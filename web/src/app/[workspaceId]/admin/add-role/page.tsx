import { AddEditRole } from '../components/addEditRole';
import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { getUserPermissionsOnServer } from '@/api/permissions/server';
import { PageNotFound, UnAuthorizedPage, WorkspaceNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkPermission } from '@/hooks/checkPermission';
import { PERMISSION_CREATE } from '@/utils/constants';
import { checkWorkspace, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function AddRole(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	const user = await getUserFromCookie();
	if (!user || !isUuid(props.params.workspaceId)) return <PageNotFound />;

	const res = await checkWorkspace(props.params.workspaceId, sessionCookie);
	if (!res) return <WorkspaceNotFound />;

	const permissions = await getUserPermissionsOnServer(queryClient, sessionCookie, props.params.workspaceId);
	if (!permissions || permissions.data.length === 0) return <UnAuthorizedPage />;
	if (!checkPermission(permissions.data, { object_type: 'role', level: PERMISSION_CREATE })) return <UnAuthorizedPage />;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer bodyClassName='bg-white' workspaceId={props.params.workspaceId}>
				<div className='mb-8'>
					<h1 className='text-2xl font-semibold leading-6 text-gray-900'>Add Role</h1>
					<p className='mt-2 text-sm text-gray-700'>Add a new role for this workspace</p>
				</div>

				<AddEditRole workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
