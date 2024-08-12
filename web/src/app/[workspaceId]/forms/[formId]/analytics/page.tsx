import { getSessionCookie } from '@/actions/auth';
import { apiClient } from '@/api/config';
import { FormAnalyticsGraphs } from '@/components/apps/forms/designer/analytics';
import { Analysis } from '@/components/apps/forms/designer/analyticsCard';
import { DataListHeader } from '@/components/lib/dataListHeader';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { ApiResponse, NextjsPageProps } from '@/utils/types';
import { redirect } from 'next/navigation';

export default async function FormAnalytics(props: NextjsPageProps<{ workspaceId: string; formId: string }>) {
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/login');
	}

	if (!isUuid(props.params.workspaceId) || !isUuid(props.params.formId)) return <PageNotFound />;

	const result: ApiResponse<{
		title: string;
		description: string;
		analysis: Analysis[];
	}> = await apiClient(`/${props.params.workspaceId}/forms/analysis/${props.params.formId}`, {
		headers: { Authorization: sessionCookie },
	});

	if (!result) return <PageNotFound />;
	return (
		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='bg-white'>
			<DataListHeader
				hideRefresh
				isFetching={false}
				// refetch={() => {}}
				workspaceId={props.params.workspaceId}
				description={result.data.description}
				title={`Form Analytics (${result.data.title})`}
			/>

			<FormAnalyticsGraphs analysis={result.data.analysis} />
		</PageContainer>
	);
}
