import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { Analysis } from '@/components/apps/forms/designer/analyticsCard';
import { ApiResponse, Form } from '@/utils/types';
import { QueryClient } from '@tanstack/react-query';

export function getSingleFormById(workspaceId: string, formId: string) {
	return () => apiClient<ApiResponse<Form>>(`/${workspaceId}/forms/one/${formId}`);
}

export function perfetchSingleFormById(queryClient: QueryClient, workspaceId: string, formId: string) {
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: getSingleFormById(workspaceId, formId),
	});
}

export function getFormAnalyticsByFormId(workspaceId: string, formId: string, sessionCookie: string) {
	return () =>
		apiClient<ApiResponse<{ title: string; description: string; analysis: Analysis[] }>>(`/${workspaceId}/forms/analysis/${formId}`, {
			headers: { Authorization: sessionCookie },
		});
}

export function perfetchFormAnalytics(queryClient: QueryClient, workspaceId: string, formId: string, sessionCookie?: string) {
	if (!sessionCookie) return;
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.formAnalytics],
		queryFn: getFormAnalyticsByFormId(workspaceId, formId, sessionCookie),
	});
}
