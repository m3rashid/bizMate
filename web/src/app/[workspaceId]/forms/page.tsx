import { getSessionCookie } from '@/actions/auth';
import { ListForms } from '@/components/apps/forms/listTable';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function FormsPage(props: NextjsPageProps<{ workspaceId: string }>) {
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId)) return <PageNotFound />;

	return (
		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
			<ListForms workspaceId={props.params.workspaceId} />
		</PageContainer>
	);
}
