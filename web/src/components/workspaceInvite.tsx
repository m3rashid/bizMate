'use client';

import {
	useGetWorkspaceInviteListQuery,
	useRespondToWorkspaceInviteMutation,
	useRevokeWorkspaceInviteMutation,
	useSendWorkspaceInviteMutation,
} from '@/api/workspaces/client';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { PingLoader } from '@/components/lib/loaders';
import { UnAuthorized } from '@/components/lib/notFound';
import { Tooltip } from '@/components/lib/tooltip';
import { usePermission } from '@/hooks/permission';
import { usePopups } from '@/hooks/popups';
import { PERMISSION_CREATE, PERMISSION_DELETE } from '@/utils/constants';
import { WorkspaceInvite } from '@/utils/types';
import UserPlusIcon from '@heroicons/react/24/outline/UserPlusIcon';
import { useParams } from 'next/navigation';
import { FormEvent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type WorkspaceInviteItemProps = WorkspaceInvite & { currentUserId: string; currentWorkspaceId?: string };

export function WorkspaceInviteItem(invite: WorkspaceInviteItemProps) {
	const { hasPermission } = usePermission();
	const { mutateAsync: acceptOrReject, isPending: acceptOrRejectPending } = useRespondToWorkspaceInviteMutation();
	const { mutateAsync: revokeInvite, isPending: revokeInvitePending } = useRevokeWorkspaceInviteMutation(invite.currentWorkspaceId);

	return (
		<div className='mb-6 rounded-lg shadow-lg ring-2 ring-gray-100'>
			<div className='mb-2 p-2.5 text-sm font-semibold'>{invite.workspace_name}</div>
			<div className='flex w-full items-center rounded-lg'>
				<button
					disabled={acceptOrRejectPending}
					className='flex-grow cursor-pointer rounded-bl-lg border-r-2 border-gray-200 p-2.5 text-center hover:bg-gray-200'
					onClick={() => acceptOrReject({ inviteId: invite.invite_id, accepted: true })}
				>
					Accept
				</button>
				<button
					disabled={acceptOrRejectPending}
					onClick={() => acceptOrReject({ inviteId: invite.invite_id, accepted: false })}
					className={twMerge(
						'flex-grow cursor-pointer p-2.5 text-center hover:bg-gray-200',
						invite.currentWorkspaceId && invite.created_by_id === invite.currentUserId ? '' : 'rounded-br-lg'
					)}
				>
					Reject
				</button>

				{hasPermission('workspace_invite', PERMISSION_DELETE) ? (
					<button
						disabled={revokeInvitePending}
						onClick={() => revokeInvite({ inviteId: invite.invite_id })}
						className='flex-grow cursor-pointer rounded-br-lg border-l-2 border-gray-200 p-2.5 text-center hover:bg-gray-200'
					>
						Revoke
					</button>
				) : null}
			</div>
		</div>
	);
}

export function WorkspaceInvites(props: { currentUserId: string }) {
	const params = useParams();
	const { data: workspaceInvites } = useGetWorkspaceInviteListQuery();

	if (!workspaceInvites) return <PingLoader className='mt-8 h-12 w-12 border-8' />;
	if (workspaceInvites.data.length === 0) {
		return (
			<div className='w-full flex-grow cursor-not-allowed rounded-lg border-2 border-dashed border-gray-300 p-12 text-center sm:min-w-96 md:max-w-lg'>
				<UserPlusIcon className='mx-auto h-8 w-8 text-gray-400' />
				<span className='mt-2 block text-sm font-semibold text-gray-900'>No pending invites</span>
			</div>
		);
	}

	return (
		<div className='min-w-72 flex-grow md:max-w-lg'>
			<div className='flex items-center justify-between'>
				<h2 className='mb-4 font-semibold'>Your invites</h2>
				<Tooltip label='Users' />
			</div>

			{workspaceInvites.data.map((invite) => (
				<WorkspaceInviteItem
					key={invite.invite_id}
					currentUserId={props.currentUserId}
					currentWorkspaceId={params.workspaceId as string}
					{...invite}
				/>
			))}
		</div>
	);
}

export function SendWorkspaceInvite() {
	const params = useParams();
	const { addMessagePopup } = usePopups();
	const formRef = useRef<HTMLFormElement>(null);
	const { hasPermission } = usePermission();
	const { mutateAsync: sendWorkspaceInvite, isPending } = useSendWorkspaceInviteMutation(formRef, params.workspaceId);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
		if (!formData.email) {
			addMessagePopup({ id: 'inviteError', message: 'Email is required', type: 'error' });
			return;
		}
		sendWorkspaceInvite({ email: formData.email as string });
	}

	if (!hasPermission('workspace_invite', PERMISSION_CREATE)) return <UnAuthorized />;
	if (!params.workspaceId) return null;
	return (
		<div className='w-full flex-grow md:max-w-md'>
			<h2 className='my-4 font-semibold'>Invite user to your workspace</h2>
			<form className='flex flex-col items-end justify-center gap-4 sm:max-w-xl lg:flex-row' onSubmit={onSubmit} ref={formRef}>
				<Input name='email' type='email' label='Invitee Email' placeholder='rashid@bizmate.com' required className='w-full flex-grow' />
				<Button
					type='submit'
					className='h-[35px] w-44'
					label='Send Invite'
					disabled={isPending}
					{...(isPending ? { RightIcon: <PingLoader /> } : {})}
				/>
			</form>
		</div>
	);
}
