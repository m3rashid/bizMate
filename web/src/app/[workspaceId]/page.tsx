import { getSession } from '@/actions/auth';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { pages } from '@/utils/constants';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function WorkspaceHome(props: NextjsPageProps<{ workspaceId: string }>) {
	const session = await getSession();

	if (!session.isAuthenticated) redirect(pages.login);
	if (!isUuid(props.params.workspaceId)) return <PageNotFound />;

	return (
		<PageContainer workspaceId={props.params.workspaceId}>
			<h1>Workspace Home</h1>
			<p>WorkspaceID: {props.params.workspaceId}</p>
		</PageContainer>
	);
}
