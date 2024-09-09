import { CreateWorkspace } from './components/chooseWorkspace';
import { WorkspaceList } from './components/workspaceList';
import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { prefetchWorkspaceInviteList, prefetchWorkspacesList } from '@/api/workspaces/server';
import { PageContainer } from '@/components/pageContainer';
import { WorkspaceInvites } from '@/components/workspaceInvite';
import { createDefaultMeta } from '@/utils/helpers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

export default async function ChooseWorkspace() {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	const user = await getUserFromCookie();
	if (!sessionCookie || !user) return null;

	await prefetchWorkspacesList(queryClient, sessionCookie);
	await prefetchWorkspaceInviteList(queryClient, sessionCookie);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer>
				<h2 className='mb-8 text-2xl font-bold'>Choose Workspace</h2>
				<div className='flex flex-col justify-between gap-8 md:flex-row'>
					<div className='flex flex-wrap items-center gap-4'>
						<WorkspaceList />
						<CreateWorkspace />
					</div>

					<div className='m-1 flex h-full max-h-[500px] min-w-72 items-center justify-center overflow-hidden overflow-x-hidden rounded-lg bg-white p-4 shadow-lg ring-2 ring-gray-100 hover:overflow-auto hover:ring-primary sm:min-w-96 md:max-w-lg'>
						<WorkspaceInvites currentUserId={user?.userId} />
					</div>
				</div>
			</PageContainer>
		</HydrationBoundary>
	);
}

export const metadata: Metadata = createDefaultMeta('Choose workspace');
