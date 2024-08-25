import { UnAuthorizedPage } from '@/components/lib/notFound';
import { SendWorkspaceInvite, WorkspaceInvites } from '@/components/workspaceInvite';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_READ } from '@/utils/constants';

export function WorkspaceInviteSettings(props: { currentUserId: string }) {
	const { hasPermission } = usePermission();

	if (!hasPermission('workspace_invite', PERMISSION_READ)) return <UnAuthorizedPage />;
	return (
		<div className='flex flex-grow flex-col justify-between gap-8 overflow-y-auto md:flex-row'>
			<SendWorkspaceInvite />
			<WorkspaceInvites currentUserId={props.currentUserId} />
		</div>
	);
}
