'use client';

import { FormView } from './singleFormView';
import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { PageLoader } from '@/components/lib/loaders';
import { ApiResponse, Form } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

export type PreviewFormProps = { formId: string; workspaceId: string };
export function PreviewForm(props: PreviewFormProps) {
	const { data, isPending } = useQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: () => apiClient<ApiResponse<Form>>(`/${props.workspaceId}/forms/one/${props.formId}`),
	});

	if (isPending) return <PageLoader />;
	return <FormView type='preview' form={data?.data} />;
}
