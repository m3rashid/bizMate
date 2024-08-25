'use client';

import { useAssignRoleToUserMutation, useGetAllRolesQuery, useGetUserRolesQuery, useRemoveRoleFromUserMutation } from '@/api/permissions/client';
import { Button } from '@/components/lib/button';
import { PingLoader } from '@/components/lib/loaders';
import { usePermission } from '@/hooks/permission';
import { usePopups } from '@/hooks/popups';
import { PERMISSION_CREATE, PERMISSION_UPDATE } from '@/utils/constants';
import { Role } from '@/utils/types';
import { twMerge } from 'tailwind-merge';

export function UserRoles(props: { userId: string; workspaceId: string }) {
	const { hasPermission } = usePermission();
	const { addMessagePopup } = usePopups();
	const { data: allRoles } = useGetAllRolesQuery(props.workspaceId);
	const { data: userRoles } = useGetUserRolesQuery(props.workspaceId, props.userId);
	const { mutateAsync: addUserToRole } = useAssignRoleToUserMutation(props.workspaceId, props.userId);
	const { mutateAsync: removeUserFromRole } = useRemoveRoleFromUserMutation(props.workspaceId, props.userId);

	if (!userRoles || !allRoles) {
		return (
			<div className='flex h-40 items-center justify-center'>
				<PingLoader className='h-12 w-12 border-8' />
			</div>
		);
	}

	const acceptedRoles: Array<Role & { owns: boolean }> = (allRoles.data.docs || []).map((role) => {
		return {
			...role,
			owns: (userRoles.data || []).some((userRole) => userRole.id === role.id),
		};
	});

	function handleAssignOrRevoke(roleId: string, owns: boolean) {
		if (!owns) {
			if (!hasPermission('permission', PERMISSION_CREATE)) {
				addMessagePopup({ type: 'error', id: 'noPermission', message: 'You do not have permission to assign this role' });
				return;
			}
			addUserToRole({ roleId });
		} else {
			if (!hasPermission('permission', PERMISSION_UPDATE)) {
				addMessagePopup({ type: 'error', id: 'noPermission', message: 'You do not have permission to revoke this role' });
				return;
			}
			removeUserFromRole({ roleId });
		}
	}

	return (
		<div className='px-2 pb-2 sm:px-4 sm:pb-4'>
			{acceptedRoles.map((role) => (
				<div key={role.id} className='flex items-center justify-between px-2 py-2'>
					<div className='font-semibold'>{role.name}</div>

					<div className='flex items-center justify-center gap-4'>
						<div
							className={twMerge(
								'cursor-not-allowed rounded-full bg-opacity-75 p-2 py-1 text-sm font-semibold text-white',
								role.owns ? 'bg-success' : 'bg-danger'
							)}
						>
							{role.owns ? 'Assigned' : 'Not assigned'}
						</div>
						<Button size='small' onClick={() => handleAssignOrRevoke(role.id, role.owns)}>
							{role.owns ? 'Revoke' : 'Assign'}
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
