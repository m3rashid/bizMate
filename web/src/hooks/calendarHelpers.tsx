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

export type CalendarParamsReturnType = {
	view: CalendarViewType;
	day: number;
	month: number;
	week: number;
	year: number;
};

export const defaultToday: CalendarParamsReturnType = {
	view: 'week',
	day: new Date().getDate(),
	month: new Date().getMonth(),
	week: getISOWeek(new Date()),
	year: new Date().getFullYear(),
};

export function getCalendarParams(params: CalendarPossibleQueryParams): CalendarParamsReturnType {
	return {
		view: params.view && calendarViewTypes.includes(params.view) ? params.view : defaultToday.view,
		day: safeStringToNumber(params.day) || defaultToday.day,
		month: safeStringToNumber(params.month) || defaultToday.month,
		week: safeStringToNumber(params.week) || defaultToday.week,
		year: safeStringToNumber(params.year) || defaultToday.year,
	};
}

export type CalendarParams =
	| { view: 'month'; year?: number; month?: number }
	| { view: 'week'; year?: number; week?: number }
	| { view: 'day'; year?: number; month?: number; day?: number };

export function getCalendarUrlQuery(calendarParams: CalendarParams) {
	const year = calendarParams.year ?? defaultToday.year;
	if (calendarParams.view === 'month') {
		const month = calendarParams.month ?? defaultToday.month;
		return `year=${year}&month=${month}`;
	}

	if (calendarParams.view === 'week') {
		const week = calendarParams.week || defaultToday.week;
		return `year=${year}&week=${week}`;
	}

	if (calendarParams.view === 'day') {
		const month = calendarParams.month ?? defaultToday.month;
		const day = calendarParams.day ?? defaultToday.day;
		return `year=${year}&month=${month}&day=${day}`;
	}
}
