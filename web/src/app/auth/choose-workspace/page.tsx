import { getSessionCookie } from '@/actions/auth';
import { apiClient } from '@/api/config';
import { CreateWorkspace, WorkspaceCard } from '@/components/auth/chooseWorkspace';
import { PageContainer } from '@/components/pageContainer';
import { ServerSideMessagePopup } from '@/components/serverSidePopup';
import { ApiResponse, Workspace } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function ChooseWorkspace() {
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	const result: ApiResponse<Workspace[]> = await apiClient('/auth/workspaces', { headers: { Authorization: sessionCookie } });

	return (
		<PageContainer>
			<div className='flex flex-wrap items-center gap-4'>
				{result ? (
					result.data?.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} />)
				) : (
					<ServerSideMessagePopup id='no-workspaces' message='Could not get workspaces' type='error' />
				)}
				<CreateWorkspace />
			</div>
		</PageContainer>
	);
}
