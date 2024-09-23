import { getSessionCookie } from '@/actions/auth';
import { getQueryClientForServer } from '@/api/config';
import { prefetchUserPermissions } from '@/api/permissions/server';
import { ComingSoon } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { createDefaultMeta } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

export default async function WorkspaceHome(props: NextjsPageProps<{ workspaceId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	await prefetchUserPermissions(queryClient, sessionCookie, props.params.workspaceId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<ComingSoon
					title='Workspace Dashboard'
					description='Workspace dashboards will be coming very soon'
					customExtras={
						<div className='mt-6 text-disabled'>
							<h2>Workspace Home</h2>
							<p>WorkspaceID: {props.params.workspaceId}</p>

							<p className='mt-8 text-gray-700'>Explore features by clicking on the apps icon on the top left</p>
						</div>
					}
				/>
			</PageContainer>
		</HydrationBoundary>
	);
}

export const metadata: Metadata = createDefaultMeta('Your Bizmate Workspace');
