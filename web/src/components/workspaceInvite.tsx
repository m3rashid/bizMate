'use client';

import { Button } from './lib/button';
import { Input } from './lib/input';
import { Loader } from './lib/loaders';
import { Tooltip } from './lib/tooltip';
import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { queryKeys } from '@/api/queryKeys';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, WorkspaceInvite } from '@/utils/types';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { FormEvent, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type WorkspaceInviteItemProps = WorkspaceInvite & { currentUserId: string; currentWorkspaceId?: string };

export function WorkspaceInviteItem(invite: WorkspaceInviteItemProps) {
	const { addMessagePopup } = usePopups();

	const { mutateAsync: acceptOrReject, isPending: acceptOrRejectPending } = useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { inviteId: string; accepted: boolean }) => apiClient('/auth/invites/respond', { method: 'POST', data }),
		onSuccess: (_, data) => {
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites, queryKeys.workspaces] });
			addMessagePopup({ id: 'inviteResponse', message: data.accepted ? 'You accepted the invite' : 'You rejected the invite', type: 'success' });
		},
		onError: () => {
			addMessagePopup({ id: 'inviteResponseError', message: 'Error in responding to this invite', type: 'error' });
		},
	});

	const { mutateAsync: revokeInvite, isPending: revokeInvitePending } = useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { inviteId: string }) => apiClient(`/auth/${invite.currentWorkspaceId}/invites/revoke`, { method: 'POST', data }),
		onSuccess: () => {
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites, queryKeys.workspaces] });
			addMessagePopup({ id: 'inviteRevoked', message: 'You revoked the invite', type: 'success' });
		},
		onError: () => {
			addMessagePopup({ id: 'inviteRevokeError', message: 'Error in revoking this invite', type: 'error' });
		},
	});

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

				{invite.currentWorkspaceId && invite.created_by_id === invite.currentUserId ? (
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

	const { data: workspaceInvites } = useQuery({
		queryKey: [queryKeys.workspaceInvites],
		queryFn: () => apiClient<ApiResponse<WorkspaceInvite[]>>('/auth/invites/all'),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});

	if (!workspaceInvites) return <Loader className='mt-8 h-12 w-12' />;
	if (workspaceInvites.data.length === 0) {
		return (
			<div className='cursor-not-allowed rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
				<UserPlusIcon className='mx-auto h-8 w-8 text-gray-400' />
				<span className='mt-2 block text-sm font-semibold text-gray-900'>No pending invites</span>
			</div>
		);
	}

	return (
		<div className='min-w-72'>
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

	const { mutateAsync: sendWorkspaceInvite, isPending } = useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { email: string }) => apiClient(`/auth/${params.workspaceId}/invites/send`, { method: 'POST', data }),
		onSuccess: () => {
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites] });
			addMessagePopup({ id: 'inviteSuccess', message: 'Invite sent successfully', type: 'success' });
			if (formRef.current) formRef.current.reset();
		},
		onError: () => {
			addMessagePopup({ id: 'inviteError', message: 'Error in sending the invite', type: 'error' });
		},
	});

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

	if (!params.workspaceId) return null;
	return (
		<div className=''>
			<h2 className='my-4 font-semibold'>Invite user to your workspace</h2>
			<form className='flex flex-col items-end justify-center gap-4 sm:max-w-xl sm:flex-row' onSubmit={onSubmit} ref={formRef}>
				<Input name='email' type='email' label='Invitee Email' placeholder='rashid@bizmate.com' required className='w-full flex-grow' />
				<Button type='submit' className='h-[35px] w-40' label='Send Invite' disabled={isPending} {...(isPending ? { RightIcon: <Loader /> } : {})} />
			</form>
		</div>
	);
}
