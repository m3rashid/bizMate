import { SendWorkspaceInvite, WorkspaceInvites } from '@/components/workspaceInvite';

export function WorkspaceInviteSettings(props: { currentUserId: string }) {
	return (
		<div className='flex flex-grow flex-col justify-between gap-8 overflow-y-auto md:flex-row'>
			<SendWorkspaceInvite />
			<WorkspaceInvites currentUserId={props.currentUserId} />
		</div>
	);
}
