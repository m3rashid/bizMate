import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { ApiResponse } from '@/utils/types';
import { QueryClient } from '@tanstack/react-query';

export type GetWorkspaceDashboardDataResponse = ApiResponse<{
	form: { active: number; inactive: number };
	users: number;
}>;

export function getWorkspaceDashboardData(workspaceId: string, sessionCookie: string) {
	return () =>
		apiClient<GetWorkspaceDashboardDataResponse>(`/${workspaceId}/dashboard/workspace-home`, { headers: { Authorization: sessionCookie } });
}

export async function prefetchWorkspaceDashboardData(queryClient: QueryClient, sessionCookie?: string, workspaceId?: string) {
	if (!workspaceId || !sessionCookie) return;
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.workspaceDashboard, workspaceId],
		queryFn: getWorkspaceDashboardData(workspaceId, sessionCookie),
	});
}
