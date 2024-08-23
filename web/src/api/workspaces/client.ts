'use client';

import { queryKeys } from '../queryKeys';
import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, Workspace, WorkspaceInvite } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RefObject } from 'react';

export function useGetWorkspaceListQuery() {
	return useQuery({
		queryKey: [queryKeys.workspaces],
		queryFn: () => apiClient<ApiResponse<Workspace[]>>('/auth/workspaces'),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useCreateWorkspaceMutation(props: { onSuccess: () => void }) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.workspaces],
		onError: () => addMessagePopup({ id: 'wsCreateFailed', type: 'error', message: 'Failed to create workspace' }),
		onSuccess: () => {
			addMessagePopup({ id: 'wsCreated', type: 'success', message: 'Workspace created successfully' });
			props.onSuccess();
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaces] });
		},
		mutationFn: (data: { name: string; description: string; color: string }) => apiClient('/auth/workspaces/create', { method: 'POST', data: data }),
	});
}

function getWorkspaceInviteList() {
	return apiClient<ApiResponse<WorkspaceInvite[]>>('/auth/invites/all');
}

export function useGetWorkspaceInviteListQuery() {
	return useQuery({
		queryKey: [queryKeys.workspaceInvites],
		queryFn: getWorkspaceInviteList,
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useSendWorkspaceInviteMutation(formRef: RefObject<HTMLFormElement>, workspaceId: string | string[]) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { email: string }) => apiClient(`/auth/${workspaceId}/invites/send`, { method: 'POST', data }),
		onSuccess: () => {
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites] });
			addMessagePopup({ id: 'inviteSuccess', message: 'Invite sent successfully', type: 'success' });
			if (formRef.current) formRef.current.reset();
		},
		onError: () => {
			addMessagePopup({ id: 'inviteError', message: 'Error in sending the invite', type: 'error' });
		},
	});
}

export function useRevokeWorkspaceInviteMutation(currentWorkspaceId?: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { inviteId: string }) => apiClient(`/auth/${currentWorkspaceId}/invites/revoke`, { method: 'POST', data }),
		onSuccess: () => {
			getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites, queryKeys.workspaces] });
			addMessagePopup({ id: 'inviteRevoked', message: 'You revoked the invite', type: 'success' });
		},
		onError: () => {
			addMessagePopup({ id: 'inviteRevokeError', message: 'Error in revoking this invite', type: 'error' });
		},
	});
}

export function useRespondToWorkspaceInviteMutation() {
	const { addMessagePopup } = usePopups();

	return useMutation({
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
}
