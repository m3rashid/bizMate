'use client';

import { AddEditEvent } from './addEditEvent';
import { CalendarHeader } from './calendarHeader';
import { FullSizeCalendar } from './fullCalendar';
import { LeftCalendarSidebar } from './leftCalendarSidebar';
import { useCalendar } from '@/hooks/calendar';
import { CalendarParamsReturnType } from '@/hooks/calendarHelpers';

export type FullSizeCalendarProps = CalendarParamsReturnType & {};

export function Calendar(params: CalendarParamsReturnType) {
	useCalendar({ initParams: params });

	return (
		<>
			<AddEditEvent />
			<CalendarHeader />

			<div className='flex h-full flex-col gap-4 sm:flex-row'>
				<LeftCalendarSidebar />
				<FullSizeCalendar />
			</div>
		</>
	);
}
