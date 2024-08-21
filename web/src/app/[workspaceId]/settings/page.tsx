import { getSessionCookie } from '@/actions/auth';
import { PageNotFound, WorkspaceNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { checkWorkspace, createDefaultMeta, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function Settings(props: NextjsPageProps<{ workspaceId: string }>) {
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
			<h1>Settings</h1>
		</PageContainer>
	);
}

export const metadata: Metadata = createDefaultMeta('Your bizmate settings');
