'use client';

import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { FormAnalyticsGraphs } from '@/components/apps/forms/designer/analytics';
import { Analysis } from '@/components/apps/forms/designer/analyticsCard';
import { DataListHeader } from '@/components/lib/dataListHeader';
import { PageLoader } from '@/components/lib/loaders';
import { ApiResponse } from '@/utils/types';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

export type AnalyticsListProps = {
	formId: string;
	workspaceId: string;
};
export function AnalyticsList(props: AnalyticsListProps) {
	const { data: result, isPending } = useQuery({
		queryKey: [queryKeys.formAnalytics],
		queryFn: () =>
			apiClient<ApiResponse<{ title: string; description: string; analysis: Analysis[] }>>(`/${props.workspaceId}/forms/analysis/${props.formId}`),
	});

	if (isPending) return <PageLoader />;
	if (!result) {
		return (
			<div className='flex h-full items-center justify-center'>
				<div className='flex flex-col items-center'>
					<FaceFrownIcon className='h-10 w-10 text-gray-500' />
					<p className='text-gray-500'>Unable to fetch form responses at the moment</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<DataListHeader
				hideRefresh
				isFetching={false}
				// refetch={() => {}}
				workspaceId={props.workspaceId}
				description={result.data.description}
				title={`Form Analytics (${result.data.title})`}
			/>

			<FormAnalyticsGraphs analysis={result.data.analysis} />
		</>
	);
}
