import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { Permission } from '@/hooks/checkPermission';
import { ApiResponse } from '@/utils/types';
import { QueryClient } from '@tanstack/react-query';

export function getAllUserPermissions(workspaceId: string, sessionCookie: string) {
	return () => apiClient<ApiResponse<Permission[]>>(`/${workspaceId}/permissions/all`, { headers: { Authorization: sessionCookie } });
}

export function prefetchUserPermissions(queryClient: QueryClient, sessionCookie: string, workspaceId?: string) {
	if (!workspaceId) return;
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.permissions],
		queryFn: getAllUserPermissions(workspaceId, sessionCookie),
	});
}
