import { getSessionCookie } from '@/actions/auth';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function WorkspaceHome(props: NextjsPageProps<{ workspaceId: string }>) {
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId)) return <PageNotFound />;

	return (
		<PageContainer workspaceId={props.params.workspaceId}>
			<h1>Workspace Home</h1>
			<p>WorkspaceID: {props.params.workspaceId}</p>
		</PageContainer>
	);
}
