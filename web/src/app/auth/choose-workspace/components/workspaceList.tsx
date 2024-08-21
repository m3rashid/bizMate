'use client';

import { WorkspaceCard } from './chooseWorkspace';
import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { Loader } from '@/components/lib/loaders';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, Workspace } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

export function WorkspaceList() {
	const { addMessagePopup } = usePopups();

	const { data, isLoading } = useQuery({
		queryKey: [queryKeys.workspaces],
		queryFn: () => apiClient<ApiResponse<Workspace[]>>('/auth/workspaces'),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});

	if (isLoading) return <Loader />;
	if (!data) {
		addMessagePopup({ message: 'Could not get workspaces', type: 'error', id: 'no-workspaces' });
		return null;
	}

	return <>{data?.data.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} />)}</>;
}
