'use client';

import { useAddBarePermissionToUserMutation, useGetUserBarePermissions, useRemovePermissionToUserMutation } from '@/api/permissions/client';
import { PingLoader } from '@/components/lib/loaders';
import { SimpleTable, SimpleTableColumn } from '@/components/lib/simpleTable';
import { Permission } from '@/hooks/checkPermission';
import { nilUuid, permissionLevelNumberToStringMap } from '@/utils/constants';
import { PermissionLevel } from '@/utils/types';

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

	const tableColumns: SimpleTableColumn<Permission>[] = [
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
			title: 'Actions',
			render: ({ row }) => <div className='flex items-center gap-4'></div>,
		},
	];

	return (
		<div>
			<SimpleTable<Permission> columns={tableColumns} data={data.data} />
			{data.data.map((permission) => {
				return <div key={permission.id}></div>;
			})}

			{JSON.stringify(data.data, null, 2)}
		</div>
	);
}
