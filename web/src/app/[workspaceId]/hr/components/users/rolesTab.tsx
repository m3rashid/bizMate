'use client';

import { useGetUserRoles } from '@/api/permissions/client';
import { PingLoader } from '@/components/lib/loaders';

export function UserRoles(props: { userId: string; workspaceId: string }) {
	const { data } = useGetUserRoles(props.workspaceId, props.userId);

	if (!data) {
		return (
			<div className='flex h-40 items-center justify-center'>
				<PingLoader className='h-12 w-12 border-8' />
			</div>
		);
	}

	if ((data.data || []).length === 0) return <div className='my-6 ml-2'>No roles assigned</div>;

	return <div>{JSON.stringify(data.data, null, 2)}</div>;
}
