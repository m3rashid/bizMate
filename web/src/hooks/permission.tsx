import { apiClient } from '@/api/config';
import { ApiResponse } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

export type Permission = {
	object_type: string;
	object_id: string;
	user_id: string;
	permission: number;
};

export function usePermission(userId: string, workspaceId: string) {
	const { data: permissions } = useQuery({
		queryKey: [`${userId}_permissions`],
		queryFn: () => apiClient<ApiResponse<Permission[]>>(`/${workspaceId}/permissions/all`),
	});

	function hasPermission(objectType: string, permission: number, objectId?: string) {
		if (!permissions) return false;
		return permissions.data.some((p) => p.object_type === objectType && p.permission === permission && (!objectId || p.object_id === objectId));
	}

	return {
		permissions,
		hasPermission,
	};
}
