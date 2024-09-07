import { apiClient } from '../config';
import { queryKeys } from '../queryKeys';
import { QueryClient } from '@tanstack/react-query';
import { getISOWeek } from 'date-fns';

export const calendarViewTypes = ['month', 'week', 'day'] as const;
export type CalendarViewType = (typeof calendarViewTypes)[number];

export type CalendarPossibleQueryParams = {
	year?: string;
	month?: string;
	week?: string;
	day?: string;
	view?: CalendarViewType;
};

function safeStringToNumber(str?: string) {
	if (!str) return undefined;
	const num = parseInt(str, 10);
	return isNaN(num) ? undefined : num;
}

type CalendarParamsReturnType = { view: CalendarViewType; day?: number; month?: number; week?: number; year?: number };
export function getCalendarParams(params: CalendarPossibleQueryParams): CalendarParamsReturnType {
	return {
		view: params.view && calendarViewTypes.includes(params.view) ? params.view : 'week',
		day: safeStringToNumber(params.day),
		month: safeStringToNumber(params.month),
		week: safeStringToNumber(params.week),
		year: safeStringToNumber(params.year),
	};
}

export type CalendarParams =
	| { view: 'month'; year?: number; month?: number }
	| { view: 'week'; year?: number; week?: number }
	| { view: 'day'; year?: number; month?: number; day?: number };

export function getCalendarUrlQuery(calendarParams: CalendarParams) {
	const year = calendarParams.year ?? new Date().getFullYear();
	if (calendarParams.view === 'month') {
		const month = calendarParams.month ?? new Date().getMonth();
		return `year=${year}&month=${month}`;
	}

	if (calendarParams.view === 'week') {
		const week = calendarParams.week || getISOWeek(new Date());
		return `year=${year}&week=${week}`;
	}

	if (calendarParams.view === 'day') {
		const month = calendarParams.month ?? new Date().getMonth();
		const day = calendarParams.day ?? new Date().getDate();
		return `year=${year}&month=${month}&day=${day}`;
	}
}

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
