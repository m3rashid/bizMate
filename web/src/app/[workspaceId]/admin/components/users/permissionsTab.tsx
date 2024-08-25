'use client';

import { useAddBarePermissionToUserMutation, useGetUserBarePermissions, useRemovePermissionToUserMutation } from '@/api/permissions/client';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { PingLoader } from '@/components/lib/loaders';
import { SimpleTable, SimpleTableColumn } from '@/components/lib/simpleTable';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { Permission } from '@/hooks/checkPermission';
import { usePopups } from '@/hooks/popups';
import { nilUuid, permissionLevelNumberToStringMap, permissionLevelStringToNumberMap, permissionObjectTypes } from '@/utils/constants';
import { isUuid } from '@/utils/helpers';
import { PermissionLevel } from '@/utils/types';
import { FormEvent } from 'react';

export function UserBarePermissions(props: { userId: string; workspaceId: string }) {
	const { addMessagePopup } = usePopups();
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

	function hanldeRevokePermission(permission: Permission) {
		removeBarePermissionFromUser({
			level: permission.level as any,
			object_type: permission.object_type as any,
			...(permission.object_id && permission.object_id !== nilUuid ? { object_id: permission.object_id } : {}),
		});
	}

	function handleAddBarePermission(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		if (!formData.object_type || !formData.level) {
			addMessagePopup({ message: 'Please fill all required fields', type: 'error', id: 'req-field' });
			return;
		}

		addBarePermissionToUser({
			level: (permissionLevelStringToNumberMap as any)[formData.level],
			object_type: formData.object_type,
			...(formData.object_id && isUuid(formData.object_id) && formData.object_id !== nilUuid ? { object_id: formData.object_id } : {}),
		});
	}

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
					<Button size='small' disabled={row.object_type === 'workspace' && row.level === 64} onClick={() => hanldeRevokePermission(row)}>
						Revoke
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<h2 className='px-4 font-semibold'>Assign new permission</h2>
			<form
				className='flex h-full w-full flex-col items-stretch justify-center gap-4 p-4 pt-2 sm:flex-row sm:items-end sm:justify-end'
				onSubmit={handleAddBarePermission}
			>
				<SingleSelectInput required name='object_type' label='Object Type' className='flex-grow' options={permissionObjectTypes as any} />

				<SingleSelectInput
					required
					name='level'
					label='Permission Level'
					className='max-w-40 flex-grow'
					options={Object.keys(permissionLevelStringToNumberMap)}
				/>

				<Input name='object_id' label='Object ID' rootClassName='max-w-48' />

				<Button className='max-w-32 flex-grow' size='small' type='submit'>
					Save
				</Button>
			</form>

			<h2 className='mb-2 mt-4 px-4 font-semibold'>Existing bare permissions</h2>
			<SimpleTable<Permission & { workspace_id: string }>
				columns={tableColumns}
				data={data.data || []}
				emptyState={
					<div className='flex h-full items-center justify-center'>
						<h3 className='my-10'>No existing bare permissions found</h3>
					</div>
				}
			/>
		</>
	);
}
