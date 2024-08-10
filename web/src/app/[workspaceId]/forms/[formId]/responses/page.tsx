import { getSessionCookie } from '@/actions/auth';
import { PageNotFound } from '@/components/lib/notFound';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function FormResponses(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	return <div>Form Responses</div>;
}
