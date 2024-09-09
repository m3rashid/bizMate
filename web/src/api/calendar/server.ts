import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { CalendarParams, getCalendarUrlQuery } from '@/hooks/calendarHelpers';
import { QueryClient } from '@tanstack/react-query';

function requestUrl(workspaceId: string, params: CalendarParams) {
	const urlQuery = getCalendarUrlQuery(params);
	return `/${workspaceId}/calendar/${params.view}?${urlQuery}`;
}

export function getCalendarEvents(workspaceId: string, sessionCookie: string, params: CalendarParams) {
	return () => apiClient(requestUrl(workspaceId, params), { headers: { Authorization: sessionCookie } });
}

export async function prefetchCalendarEvents(queryClient: QueryClient, workspaceId: string, sessionCookie: string, params: CalendarParams) {
	return queryClient.prefetchQuery({
		queryKey: [queryKeys.calendarEvents, params.view],
		queryFn: getCalendarEvents(workspaceId, sessionCookie, params),
	});
}
