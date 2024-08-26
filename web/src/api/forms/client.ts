'use client';

import { apiClient } from '../config';
import { getQueryClient } from '../provider';
import { getSingleFormById } from '@/api/forms/server';
import { queryKeys } from '@/api/queryKeys';
import { Analysis } from '@/components/apps/forms/designer/analyticsCard';
import { parseFormResponses } from '@/components/apps/forms/designer/parseFormResponses';
import { usePopups } from '@/hooks/popups';
import { ApiResponse, Form } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetSingleFormById(workspaceId: string, formId: string) {
	return useQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: getSingleFormById(workspaceId, formId),
	});
}

export function useSubmitFormResponseMutation(workspaceId: string, formId: string, formRef: React.RefObject<HTMLFormElement>) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: ['sumitFormResponse'],
		mutationFn: (data: { response: Record<string, any> }) =>
			apiClient(`/${workspaceId}/forms/response/${formId}/submit`, { method: 'POST', data: data }),
		onSuccess: (data) => {
			if (data && data.success) {
				addMessagePopup({ id: 'responseSubmitted', message: data.message || 'Response submitted successfully', type: 'success' });
				formRef.current?.reset();
			} else addMessagePopup({ id: 'responseSubmitted', message: 'Unable to submit response, please try again', type: 'error' });
		},
	});
}

export function useGetFormAnalyticsByFormId(workspaceId: string, formId: string) {
	return useQuery({
		queryKey: [queryKeys.formAnalytics],
		queryFn: () => apiClient<ApiResponse<{ title: string; description: string; analysis: Analysis[] }>>(`/${workspaceId}/forms/analysis/${formId}`),
	});
}

export function useGetFormResponseQuery(workspaceId: string, formId: string, page: number, formRes?: ApiResponse<Form> | null) {
	return useQuery({
		enabled: !!formRes,
		queryKey: [queryKeys.formResponses],
		select: (data) => parseFormResponses(formRes?.data!, data.data),
		queryFn: () => apiClient(`/${workspaceId}/forms/response/${formId}/all?page=${page}&limit=10`),
		staleTime: 0,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
	});
}

export function useDeleteFormMutation(formId: string, workspaceId: string) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: ['deleteForm', formId],
		mutationFn: () => apiClient(`/${workspaceId}/forms/delete/${formId}`, { method: 'POST' }),
		onSuccess: (data) => {
			if (data && data.success) {
				addMessagePopup({ id: formId, message: data.message || 'Form deleted successfully', type: 'success' });
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.forms] });
			} else addMessagePopup({ id: formId, message: 'Failed to delete form', type: 'error' });
		},
		onError: () => {},
	});
}

export function useCreateFormMutation(workspaceId: string, props: { onSuccess: (data: any) => void }) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.forms],
		mutationFn: (form: Partial<Form>) => apiClient(`/${workspaceId}/forms/create`, { method: 'POST', data: form }),
		onSuccess: (data) => {
			if (data && data.success) {
				addMessagePopup({ id: 'successCreatingForm', message: data.message || 'Form created successfully', type: 'success' });
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.forms] });
				props.onSuccess(data);
			} else addMessagePopup({ id: 'errorCreatingForm', message: 'An Error occured in creating form', type: 'error' });
		},
	});
}

export function useUpdateFormMutation(workspaceId: string, props: { onSuccess: () => void }) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.forms],
		mutationFn: (form: Partial<Form>) => apiClient(`/${workspaceId}/forms/update`, { method: 'POST', data: form }),
		onSuccess: (data) => {
			if (data && data.success) {
				addMessagePopup({ id: 'successUpdatingForm', message: data.message || 'Form updated successfully', type: 'success' });
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.forms] });
				props.onSuccess();
			} else addMessagePopup({ id: 'errorUpdatingForm', message: 'An Error occured in updating form', type: 'error' });
		},
	});
}

export function useUpdateFormBodyMutation(workspaceId: string, formId: string, props: { onSuccess: () => void }) {
	const { addMessagePopup } = usePopups();

	return useMutation({
		mutationKey: [queryKeys.forms],
		mutationFn: async (data: any) => apiClient(`/${workspaceId}/forms/${formId}/update-form-body`, { method: 'POST', data: data }),
		onSuccess: (data) => {
			if (data && data.success) {
				addMessagePopup({ id: 'saveForm', message: data.message || 'Successfully created form', type: 'success' });
				props.onSuccess();
			} else addMessagePopup({ id: 'errorCreateForm', message: 'Error in creating form', type: 'error' });
		},
	});
}
