import { AnalyticsList } from './components/analyticsList';
import { getSessionCookie } from '@/actions/auth';
import { apiClient, getQueryClientForServer } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { Analysis } from '@/components/apps/forms/designer/analyticsCard';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function FormAnalytics(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const queryClient = getQueryClientForServer();
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	await queryClient.prefetchQuery({
		queryKey: [queryKeys.formAnalytics],
		queryFn: () =>
			apiClient<ApiResponse<{ title: string; description: string; analysis: Analysis[] }>>(
				`/${props.params.workspaceId}/forms/analysis/${props.params.formId}`,
				{ headers: { Authorization: sessionCookie } }
			),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
				<AnalyticsList formId={props.params.formId} workspaceId={props.params.workspaceId} />
			</PageContainer>
		</HydrationBoundary>
	);
}
