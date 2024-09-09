'use client';

import { AddEditEvent } from './addEditEvent';
import { CalendarHeader } from './calendarHeader';
import { FullSizeCalendar } from './fullCalendar';
import { LeftCalendarSidebar } from './leftCalendarSidebar';
import { CalendarParamsReturnType } from '@/hooks/calendarHelpers';

export type FullSizeCalendarProps = CalendarParamsReturnType & {};

export function Calendar() {
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
