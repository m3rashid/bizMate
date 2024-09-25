"use client"

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { GetWorkspaceDashboardDataResponse } from './server';

export function useGetWorkspaceDashboardData(workspaceId: string ) {
	return useQuery({
		queryKey: [queryKeys.workspaceDashboard],
		queryFn: () => apiClient<GetWorkspaceDashboardDataResponse>(`/${workspaceId}/dashboard/workspace-home`),
	});
}
