'use client';

import { queryKeys } from '../queryKeys';
import { apiClient } from '@/api/config';
import { getQueryClient } from '@/api/provider';
import { ApiResponse, Workspace, WorkspaceInvite } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RefObject } from 'react';
import { toast } from 'sonner';

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
	return useMutation({
		mutationKey: [queryKeys.workspaces],
		mutationFn: (data: { name: string; description: string; color: string }) => apiClient('/auth/workspaces/create', { method: 'POST', data: data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Workspace created successfully');
				props.onSuccess();
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaces] });
			} else toast.error(data.message || 'Failed to create workspace');
		},
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
	return useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { email: string }) => apiClient(`/auth/${workspaceId}/invites/send`, { method: 'POST', data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Invite sent successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites] });
				if (formRef.current) formRef.current.reset();
			} else toast.error(data.message || 'Failed to send invite');
		},
	});
}

export function useRevokeWorkspaceInviteMutation(currentWorkspaceId?: string) {
	return useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { inviteId: string }) => apiClient(`/auth/${currentWorkspaceId}/invites/revoke`, { method: 'POST', data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'You revoked the invite');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites, queryKeys.workspaces] });
			} else toast.error(data.message || 'Failed to revoke invite');
		},
	});
}

export function useRespondToWorkspaceInviteMutation() {
	return useMutation({
		mutationKey: [queryKeys.workspaceInvites],
		mutationFn: (data: { inviteId: string; accepted: boolean }) => apiClient('/auth/invites/respond', { method: 'POST', data }),
		onSuccess: (res, data) => {
			if (res && res.success) {
				toast.success(res.message || (data.accepted ? 'You accepted the invite' : 'You rejected the invite'));
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaceInvites] });
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.workspaces] });
			} else toast.error(res.message || 'Failed to respond to this invite');
		},
	});
}
