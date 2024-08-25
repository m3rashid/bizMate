'use client';

import { useAddBarePermissionToUserMutation, useGetUserBarePermissions, useRemovePermissionToUserMutation } from '@/api/permissions/client';
import { Button } from '@/components/lib/button';
import { PingLoader } from '@/components/lib/loaders';
import { SimpleTable, SimpleTableColumn } from '@/components/lib/simpleTable';
import { Permission } from '@/hooks/checkPermission';
import { nilUuid, permissionLevelNumberToStringMap } from '@/utils/constants';
import { PermissionLevel } from '@/utils/types';
import { twMerge } from 'tailwind-merge';

export function UserPermissions(props: { userId: string; workspaceId: string }) {
	const { data } = useGetUserBarePermissions(props.workspaceId, props.userId);
	const { mutateAsync: addBarePermissionToUser } = useAddBarePermissionToUserMutation(props.workspaceId, props.userId);
	const { mutateAsync: removeBarePermissionFromUser } = useRemovePermissionToUserMutation(props.workspaceId, props.userId);

	if (!data) {
		return (
			<div className='flex h-40 items-center justify-center'>
				<PingLoader className='h-12 w-12 border-8' />
			</div>
		);
	}

	if ((data.data || []).length === 0) return <div className='my-6 ml-2'>No permissions assigned</div>;

	const tableColumns: SimpleTableColumn<Permission & { workspace_id: string }>[] = [
		{ dataKey: 'object_type', title: 'Object Type' },
		{
			dataKey: 'level',
			title: 'Status',
			render: ({ row }) => <p>{permissionLevelNumberToStringMap[row.level as PermissionLevel] || '0'}</p>,
		},
		{
			dataKey: 'object_id',
			title: 'Object ID',
			render: ({ row }) => <p>{row.object_id === nilUuid ? 'N/A' : row.object_id}</p>,
		},
		{
			dataKey: 'id',
			title: '',
			render: ({ row }) => (
				<div className='flex items-center gap-4'>
					<Button size='small' disabled={row.object_type === 'workspace' && row.level === 64}>
						Revoke
					</Button>
				</div>
			),
		},
	];

	return <SimpleTable<Permission & { workspace_id: string }> columns={tableColumns} data={data.data} />;
}
