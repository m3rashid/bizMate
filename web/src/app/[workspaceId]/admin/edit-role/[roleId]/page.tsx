import { EditRoleComponent } from '../components/editRole';
import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { prefetchRoleById } from '@/api/permissions/server';
import { PageNotFound, WorkspaceNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkWorkspace, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function EditRole(props: NextjsPageProps<{ workspaceId: string; roleId: string }>) {
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

	await prefetchRoleById(queryClient, sessionCookie, props.params.workspaceId, props.params.roleId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer bodyClassName='bg-white' workspaceId={props.params.workspaceId}>
				<EditRoleComponent workspaceId={props.params.workspaceId} roleId={props.params.roleId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
