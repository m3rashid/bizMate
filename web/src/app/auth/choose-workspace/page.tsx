import { CreateWorkspace } from './components/chooseWorkspace';
import { WorkspaceList } from './components/workspaceList';
import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { apiClient, getQueryClientForServer } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { PageContainer } from '@/components/pageContainer';
import { WorkspaceInvites } from '@/components/workspaceInvite';
import { createDefaultMeta } from '@/utils/helpers';
import { ApiResponse, Workspace } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function ChooseWorkspace() {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	const user = await getUserFromCookie();

	if (!sessionCookie || !user) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.workspaces],
		queryFn: () => apiClient<ApiResponse<Workspace[]>>('/auth/workspaces', { headers: { Authorization: sessionCookie } }),
	});

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.workspaceInvites],
		queryFn: () => apiClient<ApiResponse<Workspace[]>>('/auth/invites/all', { headers: { Authorization: sessionCookie } }),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer bodyClassName='bg-white'>
				<h2 className='mb-8 text-2xl font-bold'>Choose Workspace</h2>
				<div className='flex flex-col justify-between gap-8 md:flex-row'>
					<div className='flex flex-wrap items-center gap-4'>
						<WorkspaceList />
						<CreateWorkspace />
					</div>

					<div className='m-1 flex h-full max-h-[500px] min-w-72 items-center justify-center overflow-auto rounded-lg bg-white p-4 shadow-lg ring-2 ring-gray-100 hover:ring-primary'>
						<WorkspaceInvites currentUserId={user.userId} />
					</div>
				</div>
			</PageContainer>
		</HydrationBoundary>
	);
}

export const metadata: Metadata = createDefaultMeta('Choose workspace');
