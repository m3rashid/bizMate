import { SendWorkspaceInvite, WorkspaceInvites } from '@/components/workspaceInvite';

export function WorkspaceInviteSettings(props: { currentUserId: string }) {
	return (
		<div className='flex flex-col gap-8'>
			<SendWorkspaceInvite />
			<WorkspaceInvites currentUserId={props.currentUserId} />
		</div>
	);
}
