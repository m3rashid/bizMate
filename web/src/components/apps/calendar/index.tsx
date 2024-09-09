'use client';

import { CalendarHeader } from './calendarHeader';
import { CreateEditEvent } from './createEditEvent';
import { SingleDayCalendar } from './singleDay';
import { SingleMonthCalendar } from './singleMonth';
import { SingleWeekCalendar } from './singleWeek';
import { useCalendar } from '@/hooks/calendar';
import { CalendarParamsReturnType, CalendarViewType } from '@/hooks/calendarHelpers';
import { ReactNode, useMemo } from 'react';

export type FullSizeCalendarProps = CalendarParamsReturnType & {};

export function Calendar() {
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
		<>
			<CreateEditEvent />
			<CalendarHeader />

			<div className='flex flex-row sm:flex-col'>
				{/* left sidebar showing current month */}
				<div className='min-w-72'></div>

				<div className='flex-grow'>{calenderPerView[calendar.currentView]}</div>
			</div>
		</>
	);
}
