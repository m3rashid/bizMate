import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { prefetchUserPermissions } from '@/api/permissions/server';
import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { ProjectsGrid } from '../components/projectsGrid';
import { WorkspaceDashboard } from '../components/workspaceDashboard';
import { prefetchWorkspaceDashboardData } from '@/api/dashboard/server';

export default async function WorkspaceHome(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	await prefetchUserPermissions(queryClient, sessionCookie, props.params.workspaceId);
	await prefetchWorkspaceDashboardData(queryClient, sessionCookie, props.params.workspaceId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<WorkspaceDashboard  workspaceId={props.params.workspaceId} />
				<ProjectsGrid workspaceId={props.params.workspaceId}  />
			</PageContainer>
		</HydrationBoundary>
	);
}

export const metadata: Metadata = createDefaultMeta('Your Bizmate Workspace');
