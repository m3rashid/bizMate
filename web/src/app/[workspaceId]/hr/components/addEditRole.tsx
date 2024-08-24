'use client';

import { useCreateRoleMutation, useUpdateRoleMutation } from '@/api/permissions/client';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { Modal } from '@/components/lib/modal';
import { SimpleTable } from '@/components/lib/simpleTable';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { TextAreaInput } from '@/components/lib/textAreaInput';
import { usePopups } from '@/hooks/popups';
import { nilUuid, permissionLevelNumberToStringMap, permissionLevelStringToNumberMap, permissionObjectTypes } from '@/utils/constants';
import { Role, RolePermission } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type AddEditRoleProps = {
	workspaceId: string;
	role?: Role;
};

export function AddEditRole(props: AddEditRoleProps) {
	const router = useRouter();
	const { addMessagePopup } = usePopups();
	const [addEditPermissionModalOpen, setAddEditPermissionModalOpen] = useState(false);
	const [editPermissionRow, setEditPermissionRow] = useState<(RolePermission & { index: number }) | undefined>(undefined);
	const [permissions, setPermissions] = useState(props.role ? props.role.permissions : []);
	const { mutateAsync: createRole } = useCreateRoleMutation(props.workspaceId, {
		onSuccess: () => router.push(`/${props.workspaceId}/hr?tab=roles&page=1`),
	});
	const { mutateAsync: updateRole } = useUpdateRoleMutation(props.workspaceId, {
		onSuccess: () => router.push(`/${props.workspaceId}/hr?tab=roles&page=1`),
	});

	function handleAddEditRole(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		if (!formData.name) {
			addMessagePopup({ message: 'Please fill all required fields', type: 'error', id: 'req-field' });
			return;
		}

		if (permissions.length === 0) {
			addMessagePopup({ message: 'Please add permissions', type: 'error', id: 'req-field' });
			return;
		}

		if (!!props.role) {
			updateRole({
				...props.role,
				...formData,
				permissions: permissions.map((perm) => ({ ...perm, object_id: perm.object_id || undefined })),
				workspaceId: props.workspaceId,
				roleId: props.role.id,
			});
		} else {
			createRole({
				...formData,
				permissions: permissions.map((perm) => ({ ...perm, object_id: perm.object_id || undefined })),
				workspaceId: props.workspaceId,
			});
		}
	}

	function addPermission(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		if (!formData.object_type || !formData.level) {
			addMessagePopup({ message: 'Please fill all required fields', type: 'error', id: 'req-field' });
			return;
		}

		const newPermission: RolePermission = {
			...formData,
			level: (permissionLevelStringToNumberMap as any)[formData.level] || 0,
		};

		if (editPermissionRow) {
			const newPermissions = [...permissions];
			newPermissions[editPermissionRow.index] = newPermission;
			setPermissions(newPermissions);
		} else {
			setPermissions([...permissions, newPermission]);
		}

		setEditPermissionRow(undefined);
		setAddEditPermissionModalOpen(false);
	}

	function openAddPermissionModal() {
		setAddEditPermissionModalOpen(true);
	}

	function removePermissionAtIndex(index: number) {
		setPermissions((prev) => prev.filter((_, i) => i !== index));
	}

	return (
		<>
			<Modal
				open={addEditPermissionModalOpen}
				setOpen={setAddEditPermissionModalOpen}
				title={!!editPermissionRow ? 'Edit Permission' : 'Add Permission'}
			>
				<form className='h-full pt-4' onSubmit={addPermission}>
					<div className='flex flex-col gap-4 px-4'>
						<SingleSelectInput
							required
							name='object_type'
							label='Object Type'
							default={editPermissionRow?.object_type}
							options={permissionObjectTypes as any}
						/>

						{/* TODO: also take objectID into account */}
						{/* <Input name='object_id' label='Object ID' defaultValue={editPermissionRow?.object_id} /> */}

						<SingleSelectInput
							required
							name='level'
							label='Permission Level'
							default={!!editPermissionRow ? permissionLevelNumberToStringMap[editPermissionRow.level] : undefined}
							options={Object.keys(permissionLevelStringToNumberMap)}
						/>
					</div>

					<div className='mt-4 flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2'>
						<Button variant='simple' type='reset'>
							Reset
						</Button>
						<Button type='submit'>Save</Button>
					</div>
				</form>
			</Modal>

			<form onSubmit={handleAddEditRole}>
				<div className='flex flex-grow flex-col gap-8 overflow-y-auto md:flex-row'>
					<div className='max-w-md flex-grow'>
						<Input name='name' required label='Name' defaultValue={props.role?.name} />
						<TextAreaInput name='description' label='description' defaultValue={props.role?.description} />
					</div>

					<div className='flex-grow'>
						<div className='mb-4 flex items-baseline gap-8'>
							<p>
								Permissions <span className='text-danger'>*</span>
							</p>

							{permissions.length > 0 ? (
								<Button type='button' size='small' onClick={openAddPermissionModal}>
									Add Permissions
								</Button>
							) : null}
						</div>

						{permissions.length === 0 ? (
							<div className='flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-disabled'>
								<Button type='button' size='small' onClick={openAddPermissionModal}>
									Add Permissions
								</Button>
							</div>
						) : null}

						<SimpleTable<any>
							data={permissions}
							columns={[
								{ dataKey: 'object_type', title: 'Object Type' },
								{ dataKey: 'object_id', title: 'Object ID', render: ({ row }) => (row.object_id === nilUuid ? 'N/A' : row.object_id) },
								{
									dataKey: 'level',
									title: 'Permission Level',
									render: ({ row }) => (permissionLevelNumberToStringMap as any)[row.level] || 'unknown',
								},
								{
									dataKey: 'actions',
									title: 'Actions',
									render: ({ row, rowIndex }) => (
										<div className='flex gap-2'>
											<Button
												type='button'
												size='small'
												onClick={(e) => {
													e.preventDefault();
													removePermissionAtIndex(rowIndex);
												}}
											>
												Remove
											</Button>
											<Button
												type='button'
												size='small'
												onClick={(e) => {
													e.preventDefault();
													setAddEditPermissionModalOpen(true);
													setEditPermissionRow({ ...row, index: rowIndex });
												}}
											>
												Edit
											</Button>
										</div>
									),
								},
							]}
						/>
					</div>
				</div>

				<div className='flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2'>
					<Button variant='simple' type='reset'>
						Reset
					</Button>
					<Button type='submit'>Save</Button>
				</div>
			</form>
		</>
	);
}
