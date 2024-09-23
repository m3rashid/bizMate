import { getUserFromCookie } from '@/actions/auth';
import { ComingSoon } from '@/components/lib/notFound';
import { PageContainer } from '@/components/pageContainer';
import {
	CalendarPossibleQueryParams, //  getCalendarParams, getCalendarUrlQuery
} from '@/hooks/calendarHelpers';
import { NextjsPageProps } from '@/utils/types';

// import { redirect } from 'next/navigation';

export default async function CalendarPage(props: NextjsPageProps<{ workspaceId: string }, CalendarPossibleQueryParams>) {
	const user = await getUserFromCookie();

	// const calendarParams = getCalendarParams(props.searchParams);
	// const calendarQuery = getCalendarUrlQuery(calendarParams);

	if (!user) return null;
	// return redirect(`/app/${props.params.workspaceId}/calendar/${user.userId}?${calendarQuery}`);
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
