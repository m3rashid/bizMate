import { AdminTabs } from './components';
import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { prefetchUserPermissions } from '@/api/permissions/server';
import { PageContainer } from '@/components/pageContainer';
import { NextjsPageProps } from '@/utils/types';

export default async function HumanResources(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	const user = await getUserFromCookie();
	await prefetchUserPermissions(queryClient, sessionCookie, props.params.workspaceId);

	return (
		<PageContainer workspaceId={props.params.workspaceId}>
			<AdminTabs currentUserId={user!.userId} workspaceId={props.params.workspaceId} />
		</PageContainer>
	);
}
