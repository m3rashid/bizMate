'use client';

import { apiClient } from './config';
import { queryKeys } from './queryKeys';
import { Activity, ApiResponse } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

// TODO: allow filter parameters
export function useGetWorkspaceActivityQuery(workspaceId: string, page: number, limit: number) {
	return useQuery({
		queryKey: [queryKeys.workspaceActivity, page],
		queryFn: () => apiClient<ApiResponse<Activity[]>>(`/${workspaceId}/activity/all?page=${page}&limit=${limit}`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

// TODO: allow filter parameters
export function useGetSingleUserActivity(workspaceId: string, userEmail: string, page: number, limit: number) {
	return useQuery({
		queryKey: [queryKeys.userActivity, workspaceId, userEmail, page],
		queryFn: () => apiClient<ApiResponse<Activity[]>>(`/${workspaceId}/activity/user/${userEmail}/all?page=${page}&limit=${limit}`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}
