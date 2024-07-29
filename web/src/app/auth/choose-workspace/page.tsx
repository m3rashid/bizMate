import { getSession } from '@/actions/auth';
import { apiClient } from '@/api/config';
import { CreateWorkspace, WorkspaceCard } from '@/components/auth/chooseWorkspace';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Workspace } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function ChooseWorkspace() {
	const session = await getSession();
	if (!session.isAuthenticated) redirect('/auth/login');

	const result: ApiResponse<Workspace[]> = await apiClient('/auth/workspaces', {
		headers: { Authorization: `Bearer ${session.token}` },
	});

	return (
		<PageContainer>
			<div className='flex flex-wrap items-center gap-4'>
				{result ? result.data?.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} />) : null}
				<CreateWorkspace />
			</div>
		</PageContainer>
	);
}
