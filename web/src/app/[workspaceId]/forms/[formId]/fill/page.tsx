import { getSessionCookie } from '@/actions/auth';
import { apiClient } from '@/api/config';
import { PageNotFound } from '@/components/lib/notFound';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, Form, NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function FillForm(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const result: ApiResponse<Form> = await apiClient(`/${props.params.workspaceId}/forms/one/${props.params.formId}`, {
		headers: { Authorization: sessionCookie },
	});
	console.log(result);

	return <div>Fill Form</div>;
}
