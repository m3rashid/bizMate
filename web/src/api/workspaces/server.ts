import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { ApiResponse, Workspace, WorkspaceInvite } from '@/utils/types';
import { QueryClient } from '@tanstack/react-query';

export function getWorkspacesList(sessionCookie: string) {
	return () => apiClient<ApiResponse<Workspace[]>>('/auth/workspaces', { headers: { Authorization: sessionCookie } });
}

export function prefetchWorkspacesList(queryClient: QueryClient, sessionCookie: string) {
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.workspaces],
		queryFn: getWorkspacesList(sessionCookie),
	});
}

export function getWorkspaceInviteList(sessionCookie: string) {
	return () => apiClient<ApiResponse<WorkspaceInvite[]>>('/auth/invites/all', { headers: { Authorization: sessionCookie } });
}

export function prefetchWorkspaceInviteList(queryClient: QueryClient, sessionCookie: string) {
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.workspaceInvites],
		queryFn: getWorkspaceInviteList(sessionCookie),
	});
}
