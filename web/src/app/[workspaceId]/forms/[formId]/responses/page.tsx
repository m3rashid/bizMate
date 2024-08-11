import { getSessionCookie } from '@/actions/auth';
import { apiClient } from '@/api/config';
import FormResponsesTable from '@/components/apps/forms/designer/formResponse';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function FormResponses(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const result: ApiResponse<Form> = await apiClient(`/${props.params.workspaceId}/forms/one/${props.params.formId}`, {
		headers: { Authorization: sessionCookie },
	});

	return (
		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
			<FormResponsesTable form={result.data} workspaceId={props.params.workspaceId} />
		</PageContainer>
	);
}
