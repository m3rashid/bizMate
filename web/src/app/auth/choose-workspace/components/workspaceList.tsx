'use client';

import { WorkspaceCard } from './chooseWorkspace';
import { useGetWorkspaceListQuery } from '@/api/workspaces/client';
import { Loader } from '@/components/lib/loaders';
import { usePopups } from '@/hooks/popups';

export function WorkspaceList() {
	const { addMessagePopup } = usePopups();
	const { data, isLoading } = useGetWorkspaceListQuery();

	if (isLoading) return <Loader />;
	if (!data) {
		addMessagePopup({ message: 'Could not get workspaces', type: 'error', id: 'no-workspaces' });
		return null;
	}

	return <>{data?.data.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} />)}</>;
}
