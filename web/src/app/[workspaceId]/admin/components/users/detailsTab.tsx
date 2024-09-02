'use client';

import { useGetUserBarePermissions, useRemoveUserFromWorkspace } from '@/api/permissions/client';
import { AlertDialog } from '@/components/lib/alertDialog';
import { Button } from '@/components/lib/button';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_DELETE } from '@/utils/constants';
import { snakeCaseToSentenceCase } from '@/utils/helpers';
import { User } from '@/utils/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function UserDetails(props: { workspaceId: string; user: User }) {
	const { hasPermission } = usePermission();
	const { data: barePermissions } = useGetUserBarePermissions(props.workspaceId, props.user.id);
	const { mutateAsync: removeUserFromWorkspace } = useRemoveUserFromWorkspace(props.workspaceId, props.user.id);

	function handleRemoveUserFromWorkspace() {
		if (!hasPermission('user', PERMISSION_DELETE)) {
			toast.error('You do not have permission to remove this user');
			return;
		}
		removeUserFromWorkspace();
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
								<td className='py-0.5 pl-2'>{key === 'created_at' ? format(new Date(value as string), 'DD MMM YYYY HH:mm A') : value}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<div className='float-right mt-4'>
				<AlertDialog
					title='Are you sure?'
					confirmAction={handleRemoveUserFromWorkspace}
					description='Are you sure you want to remove this user from the workspace?'
				>
					<Button size='small' variant='danger' disabled={revokeButtonDisabled}>
						Remove user from workspace
					</Button>
				</AlertDialog>
			</div>
		</div>
	);
}
