import { getSessionCookie } from '@/actions/auth';
// import { prefetchCalendarEvents } from '@/api/calendar/server';
// import { getQueryClientForServer } from '@/api/config';
// import { Calendar } from '@/components/apps/calendar';
import { ComingSoon, PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import {
	CalendarPossibleQueryParams, // getCalendarParams
} from '@/hooks/calendarHelpers';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';

// import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function CalendarPage(props: NextjsPageProps<{ workspaceId: string; userId: string }, CalendarPossibleQueryParams>) {
	if (!isUuid(props.params.userId)) return <PageNotFound />;
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) return null;

	// const queryClient = getQueryClientForServer();
	// const calendarParams = getCalendarParams(props.searchParams);

	// await prefetchCalendarEvents(queryClient, props.params.workspaceId, sessionCookie, calendarParams);

	// return (
	// 	<HydrationBoundary state={dehydrate(queryClient)}>
	// 		<PageContainer workspaceId={props.params.workspaceId} bodyClassName='overflow-hidden p-0 sm:p-0'>
	// 			<Calendar {...calendarParams} />
	// 		</PageContainer>
	// 	</HydrationBoundary>
	// );

	return (
		<PageContainer workspaceId={props.params.workspaceId}>
			<ComingSoon
				title='Events and Calendar'
				description='Events, Schedule and calendar will be coming very soon'
				customExtras={
					<div className='mt-6 text-disabled'>
						<h2>Calendar Home</h2>
						<p>WorkspaceID: {props.params.workspaceId}</p>
						<p className='mt-8 text-gray-700'>Explore features by clicking on the apps icon on the top left</p>
					</div>
				}
			/>
		</PageContainer>
	);
}
