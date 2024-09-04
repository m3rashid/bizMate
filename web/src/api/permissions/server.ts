import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { ApiResponse, Role, RolePermission } from '@/utils/types';
import { QueryClient } from '@tanstack/react-query';

export function getAllUserPermissions(workspaceId: string, sessionCookie: string) {
	return () => apiClient<ApiResponse<RolePermission[]>>(`/${workspaceId}/permissions/all`, { headers: { Authorization: sessionCookie } });
}

export function prefetchUserPermissions(queryClient: QueryClient, sessionCookie?: string, workspaceId?: string) {
	if (!workspaceId || !sessionCookie) return;
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.permissions],
		queryFn: getAllUserPermissions(workspaceId, sessionCookie),
	});
}

export function prefetchRoleById(queryClient: QueryClient, workspaceId: string, roleId: string, sessionCookie?: string) {
	if (!sessionCookie) return;
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.roles, roleId],
		queryFn: () => apiClient<ApiResponse<Role>>(`/${workspaceId}/permissions/roles/one/${roleId}`, { headers: { Authorization: sessionCookie } }),
	});
}

export async function getUserPermissionsOnServer(queryClient: QueryClient, workspaceId: string, sessionCookie?: string) {
	const res = await apiClient<ApiResponse<RolePermission[]>>(`/${workspaceId}/permissions/all`, { headers: { Authorization: sessionCookie } });
	queryClient.setQueryData([queryKeys.permissions], res);
	return res;
}
