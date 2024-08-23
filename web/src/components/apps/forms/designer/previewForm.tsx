'use client';

import { FormView } from './singleFormView';
import { useGetSingleFormById } from '@/api/forms/client';
import { PageLoader } from '@/components/lib/loaders';

export type PreviewFormProps = { formId: string; workspaceId: string };
export function PreviewForm(props: PreviewFormProps) {
	const { data, isPending } = useGetSingleFormById(props.workspaceId, props.formId);

	if (isPending) return <PageLoader />;
	return <FormView type='preview' form={data?.data} />;
}
