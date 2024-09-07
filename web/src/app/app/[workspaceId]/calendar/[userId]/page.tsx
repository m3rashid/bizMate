import { getSessionCookie } from '@/actions/auth';
import { CalendarPossibleQueryParams, getCalendarParams, prefetchCalendarEvents } from '@/api/calendar/server';
import { getQueryClientForServer } from '@/api/config';
import { Button } from '@/components/lib/button';
import { PageNotFound } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import { isUuid } from '@/utils/helpers';
import { NextjsPageProps } from '@/utils/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function CalendarPage(props: NextjsPageProps<{ workspaceId: string; userId: string }, CalendarPossibleQueryParams>) {
	if (!isUuid(props.params.userId)) return <PageNotFound />;
	const sessionCookie = await getSessionCookie();
	if (!sessionCookie) return null;

	const queryClient = getQueryClientForServer();
	const calendarParams = getCalendarParams(props.searchParams);

	await prefetchCalendarEvents(queryClient, props.params.workspaceId, sessionCookie, calendarParams);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PageContainer workspaceId={props.params.workspaceId}>
				<div className='flex items-center justify-between gap-4'>
					<h1 className='text-xl font-semibold'>Calendar events</h1>
					<Button size='small'>Add Event</Button>
				</div>

				<h1>
					Hello user :: {props.params.userId} from {props.params.workspaceId}
				</h1>
			</PageContainer>
		</HydrationBoundary>
	);
}
