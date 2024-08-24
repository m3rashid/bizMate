'use client';

import { apiClient } from '../config';
import { usePopups } from '@/hooks/popups';
import { ApiResponse } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';

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
	const { addMessagePopup } = usePopups();

	return useMutation({
		onSuccess: props.onSuccess,
		onError: (error, variables) => {
			props.onError();
			addMessagePopup({
				type: 'error',
				message: (error as any) || 'An error occurred',
				id: `${result?.data.fileNameWithoutExt}.${variables.format}` || `${tableName}.${variables.format}`,
			});
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
