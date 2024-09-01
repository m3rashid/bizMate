'use client';

import { WorkspaceCard } from './chooseWorkspace';
import { useGetWorkspaceListQuery } from '@/api/workspaces/client';
import { PingLoader } from '@/components/lib/loaders';
import { toast } from 'sonner';

export function WorkspaceList() {
	const { data, isLoading } = useGetWorkspaceListQuery();

	if (isLoading) {
		return (
			<div className='flex h-52 w-52 select-none items-center justify-center'>
				<PingLoader className='mt-8 h-12 w-12 border-8' />
			</div>
		);
	}

	if (!data) {
		toast.error('Could not get workspaces');
		return null;
	}

	return <>{data?.data.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} />)}</>;
}
