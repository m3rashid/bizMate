import { getSessionCookie, getUserFromCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { PageContainer } from '@/components/pageContainer';
import { NextjsPageProps } from '@/utils/types';

export default async function WorkspaceAdmin(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	const user = await getUserFromCookie();

	return (
		<PageContainer workspaceId={props.params.workspaceId}>
			<div className=''></div>
		</PageContainer>
	);
}
