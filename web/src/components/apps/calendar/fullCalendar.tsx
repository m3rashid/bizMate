'use client';

import { SingleDayCalendar } from './singleDay';
import { SingleMonthCalendar } from './singleMonth';
import { SingleWeekCalendar } from './singleWeek';
import { useCalendar } from '@/hooks/calendar';
import { CalendarViewType } from '@/hooks/calendarHelpers';
import { ReactNode, useMemo } from 'react';

export type FullSizeCalendarProps = {};

export function FullSizeCalendar() {
	const { calendar } = useCalendar();

	const calenderPerView: Record<CalendarViewType, ReactNode> = useMemo(
		() => ({
			month: <SingleMonthCalendar />,
			week: <SingleWeekCalendar />,
			day: <SingleDayCalendar />,
		}),
		[]
	);

	return (
		<div className='flex-grow overflow-y-hidden p-2 pt-0 shadow-lg hover:overflow-auto sm:p-3 sm:pt-0'>{calenderPerView[calendar.currentView]}</div>
	);
}
