'use client';

import { useGetUserBarePermissions, useRemoveUserFromWorkspace } from '@/api/permissions/client';
import { Button } from '@/components/lib/button';
import { usePermission } from '@/hooks/permission';
import { usePopups } from '@/hooks/popups';
import { PERMISSION_DELETE } from '@/utils/constants';
import { snakeCaseToSentenceCase } from '@/utils/helpers';
import { User } from '@/utils/types';
import dayjs from 'dayjs';
import { toast } from 'sonner';

export function UserDetails(props: { workspaceId: string; user: User }) {
	const { addActionPopup } = usePopups();
	const { hasPermission } = usePermission();
	const { data: barePermissions } = useGetUserBarePermissions(props.workspaceId, props.user.id);
	const { mutateAsync: removeUserFromWorkspace } = useRemoveUserFromWorkspace(props.workspaceId, props.user.id);

	function handleRemoveUserFromWorkspace() {
		if (!hasPermission('user', PERMISSION_DELETE)) {
			toast.error('You do not have permission to remove this user');
			return;
		}

		addActionPopup({
			simple: true,
			type: 'warning',
			id: 'sureToRemoveUser',
			title: 'Are you sure ?',
			confirmButtonLabel: 'Remove',
			onConfirm: removeUserFromWorkspace,
			description: 'Are you sure you want to remove this user from the workspace?',
		});
	}

	const revokeButtonDisabled =
		!hasPermission('user', PERMISSION_DELETE) ||
		(barePermissions?.data || []).some((permission) => permission.object_type === 'workspace' && permission.level === 64);

	return (
		<div className='px-2 pb-2 sm:px-4 sm:pb-4'>
			<table className='border-spacing-x-8'>
				<tbody>
					{Object.entries(props.user).map(([key, value]) => {
						if (!value) return null;
						return (
							<tr key={key}>
								<td className='py-0.5 pr-2 font-semibold'>{snakeCaseToSentenceCase(key)}</td>
								<td className='py-0.5 pl-2'>{key === 'created_at' ? dayjs(value as any).format('DD MMM YYYY HH:mm A') : value}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<div className='float-right mt-4'>
				<Button size='small' variant='danger' onClick={handleRemoveUserFromWorkspace} disabled={revokeButtonDisabled}>
					Remove user from workspace
				</Button>
			</div>
		</div>
	);
}
