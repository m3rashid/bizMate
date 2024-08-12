import { getSessionCookie } from '@/actions/auth';
import { apiClient, getQueryClientForServer } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { FormFillup } from '@/components/apps/forms/designer/fillForm';
import { PageNotFound } from '@/components/lib/notFound';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';

export default async function FillForm(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: () => apiClient<ApiResponse<Form>>(`/${props.params.workspaceId}/forms/one/${props.params.formId}`),
	});

	return (
		<div className='flex justify-center p-4'>
			<FormFillup formId={props.params.formId} workspaceId={props.params.workspaceId} loggedIn={!!sessionCookie} />
		</div>
	);
}
