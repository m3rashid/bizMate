'use client';

import { apiClient } from '../config';
import { getQueryClient } from '../provider';
import { getSingleFormById } from '@/api/forms/server';
import { queryKeys } from '@/api/queryKeys';
import { Analysis } from '@/components/apps/forms/designer/analyticsCard';
import { parseFormResponses } from '@/components/apps/forms/designer/parseFormResponses';
// import { usePopups } from '@/hooks/popups';
import { ApiResponse, Form } from '@/utils/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useGetSingleFormById(workspaceId: string, formId: string) {
	return useQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: getSingleFormById(workspaceId, formId),
	});
}

export function useSubmitFormResponseMutation(workspaceId: string, formId: string, formRef: React.RefObject<HTMLFormElement>) {
	return useMutation({
		mutationKey: ['sumitFormResponse'],
		mutationFn: (data: { response: Record<string, any> }) =>
			apiClient(`/${workspaceId}/forms/response/${formId}/submit`, { method: 'POST', data: data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Response submitted successfully');
				formRef.current?.reset();
			} else toast.error(data.message || 'Unable to submit response, please try again');
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
	return useMutation({
		mutationKey: ['deleteForm', formId],
		mutationFn: () => apiClient(`/${workspaceId}/forms/delete/${formId}`, { method: 'POST' }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Form deleted successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.forms] });
			} else toast.error(data.message || 'Failed to delete form');
		},
		onError: () => {},
	});
}

export function useCreateFormMutation(workspaceId: string, props: { onSuccess: (data: any) => void }) {
	return useMutation({
		mutationKey: [queryKeys.forms],
		mutationFn: (form: Partial<Form>) => apiClient(`/${workspaceId}/forms/create`, { method: 'POST', data: form }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Form created successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.forms] });
				props.onSuccess(data);
			} else toast.error(data.message || 'An Error occured in creating form');
		},
	});
}

export function useUpdateFormMutation(workspaceId: string, props: { onSuccess: () => void }) {
	return useMutation({
		mutationKey: [queryKeys.forms],
		mutationFn: (form: Partial<Form>) => apiClient(`/${workspaceId}/forms/update`, { method: 'POST', data: form }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Form updated successfully');
				getQueryClient().invalidateQueries({ queryKey: [queryKeys.forms] });
				props.onSuccess();
			} else toast.error(data.message || 'An Error occured in updating form');
		},
	});
}

export function useUpdateFormBodyMutation(workspaceId: string, formId: string, props: { onSuccess: () => void }) {
	return useMutation({
		mutationKey: [queryKeys.forms],
		mutationFn: async (data: any) => apiClient(`/${workspaceId}/forms/${formId}/update-form-body`, { method: 'POST', data: data }),
		onSuccess: (data) => {
			if (data && data.success) {
				toast.success(data.message || 'Form updated successfully');
				props.onSuccess();
			} else toast.error(data.message || 'An Error occured in updating form');
		},
	});
}
