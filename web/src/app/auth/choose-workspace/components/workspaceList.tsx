'use client';

import { WorkspaceCard } from './chooseWorkspace';
import { useGetWorkspaceListQuery } from '@/api/workspaces/client';
import { PingLoader } from '@/components/lib/loaders';
import { usePopups } from '@/hooks/popups';

export function WorkspaceList() {
	const { addMessagePopup } = usePopups();
	const { data, isLoading } = useGetWorkspaceListQuery();

	if (isLoading)
		return (
			<div className='flex h-52 w-52 select-none items-center justify-center'>
				<PingLoader className='mt-8 h-12 w-12 border-8' />
			</div>
		);
	if (!data) {
		addMessagePopup({ message: 'Could not get workspaces', type: 'error', id: 'no-workspaces' });
		return null;
	}

	return <>{data?.data.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} />)}</>;
}
