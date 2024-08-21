import { CreateWorkspace } from './components/chooseWorkspace';
import { WorkspaceList } from './components/workspaceList';
import { getSessionCookie } from '@/actions/auth';
import { apiClient, getQueryClientForServer } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { PageContainer } from '@/components/pageContainer';
import { ApiResponse, Workspace } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function ChooseWorkspace() {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.workspaces],
		queryFn: () => apiClient<ApiResponse<Workspace[]>>('/auth/workspaces', { headers: { Authorization: sessionCookie } }),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer>
				<div className='flex flex-wrap items-center gap-4'>
					<WorkspaceList />
					<CreateWorkspace />
				</div>
			</PageContainer>
		</HydrationBoundary>
	);
}
