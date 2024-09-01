'use client';

import { apiClient } from '../config';
import { ApiResponse } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type TableFieldsResponse = {
	fileNameWithoutExt: string;
	fields: Array<{ name: string; label: string }>;
};

export function useGetExportTableFieldsQuery(tableName: string, workspaceId: string, formId?: string) {
	return useQuery({
		queryKey: [tableName],
		queryFn: () =>
			apiClient<ApiResponse<TableFieldsResponse>>(`/${workspaceId}/export/table-fields`, {
				method: 'POST',
				data: { tableName, ...(formId ? { formId } : {}) },
			}),
	});
}

export function useExportTableMutation(
	tableName: string,
	workspaceId: string,
	result: ApiResponse<TableFieldsResponse> | null | undefined,
	props: { onSuccess: () => void; onError: () => void }
) {
	return useMutation({
		onSuccess: props.onSuccess,
		onError: (error, variables) => {
			props.onError();
			toast.error((error as any) || 'An error occurred');
		},
		mutationKey: [tableName],
		mutationFn: (data: any) =>
			apiClient(
				`/${workspaceId}/export/table`,
				{ method: 'POST', data: data },
				{
					downloadableContent: {
						fileName: `${result?.data.fileNameWithoutExt}.${data.format}` || `${tableName}.${data.format}`,
					},
				}
			),
	});
}
