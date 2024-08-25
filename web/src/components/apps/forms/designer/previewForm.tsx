'use client';

import { FormView } from './singleFormView';
import { useGetSingleFormById } from '@/api/forms/client';
import { PageLoader } from '@/components/lib/loaders';
import { UnAuthorizedPage } from '@/components/lib/notFound';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_READ } from '@/utils/constants';

export type PreviewFormProps = { formId: string; workspaceId: string };

export function PreviewForm(props: PreviewFormProps) {
	const { hasPermission } = usePermission();
	const { data, isPending } = useGetSingleFormById(props.workspaceId, props.formId);

	if (!hasPermission('form', PERMISSION_READ)) return <UnAuthorizedPage />;
	if (isPending) return <PageLoader />;

	return <FormView type='preview' form={data?.data} />;
}
