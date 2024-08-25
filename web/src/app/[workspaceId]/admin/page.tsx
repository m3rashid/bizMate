import { HrTabs } from './components';
import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { PageNotFound, WorkspaceNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkWorkspace, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function HumanResources(props: NextjsPageProps<{ workspaceId: string }>) {
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	const user = await getUserFromCookie();
	if (!user || !isUuid(props.params.workspaceId)) return <PageNotFound />;

	const res = await checkWorkspace(props.params.workspaceId, sessionCookie);
	if (!res) return <WorkspaceNotFound />;

	return (
		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
			<HrTabs currentUserId={user.userId} workspaceId={props.params.workspaceId} />
		</PageContainer>
	);
}
