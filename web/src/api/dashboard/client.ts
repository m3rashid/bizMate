'use client';

import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { GetWorkspaceDashboardDataResponse } from './server';
import { useQuery } from '@tanstack/react-query';

export function useGetWorkspaceDashboardData(workspaceId: string) {
	return useQuery({
		queryKey: [queryKeys.workspaceDashboard],
		queryFn: () => apiClient<GetWorkspaceDashboardDataResponse>(`/${workspaceId}/dashboard/workspace-home`),
	});
}
