import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { prefetchUserPermissions } from '@/api/permissions/server';
import { DatePicker } from '@/components/lib/datePicker';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta, isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function WorkspaceHome(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();

	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId)) return <PageNotFound />;
	await prefetchUserPermissions(queryClient, sessionCookie, props.params.workspaceId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<h1>Workspace Home</h1>
				<p>WorkspaceID: {props.params.workspaceId}</p>

				<DatePicker />
			</PageContainer>
		</HydrationBoundary>
	);
}

export const metadata: Metadata = createDefaultMeta('Your Bizmate Workspace');
