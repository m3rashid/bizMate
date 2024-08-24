'use client';

import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { Permission } from '@/hooks/checkPermission';
import { ApiResponse } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export function useGetUserPermissions() {
	const params = useParams();
	return useQuery({
		queryKey: [queryKeys.permissions],
		queryFn: () => {
			if (params.workspaceId) return apiClient<ApiResponse<Permission[]>>(`/${params.workspaceId}/permissions/all`);
		},
	});
}
