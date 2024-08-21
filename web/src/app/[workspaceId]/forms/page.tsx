import { getSessionCookie } from '@/actions/auth';
import { ListForms } from '@/components/apps/forms/listTable';
import { PageNotFound, WorkspaceNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkWorkspace, createDefaultMeta, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function FormsPage(props: NextjsPageProps<{ workspaceId: string }>) {
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId)) return <PageNotFound />;

	const res = await checkWorkspace(props.params.workspaceId, sessionCookie);
	if (!res) return <WorkspaceNotFound />;

	return (
		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
			<ListForms workspaceId={props.params.workspaceId} />
		</PageContainer>
	);
}

export const metadata: Metadata = createDefaultMeta('Forms', 'Manage your forms');
