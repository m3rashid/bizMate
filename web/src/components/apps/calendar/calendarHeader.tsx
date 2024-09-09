'use client';

import { Button } from '@/components/lib/button';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { useCalendar } from '@/hooks/calendar';
import { calendarViewTypes } from '@/hooks/calendarHelpers';
import { toSentenceCase } from '@/utils/helpers';

export function CalendarHeader() {
	const { openAddEditModal, calendar, changeCalendarView } = useCalendar();

	return (
		<div className='flex items-center justify-between gap-4'>
			<h1 className='text-xl font-semibold'>Calendar events</h1>

			<div className='flex items-center gap-2'>
				<SingleSelectInput
					value={calendar.currentView}
					onChange={(value) => changeCalendarView(value as any)}
					options={calendarViewTypes.map((val) => ({ label: toSentenceCase(val), value: val }))}
				/>

				<Button size='small' onClick={openAddEditModal}>
					Add Event
				</Button>
			</div>
		</div>
	);
}
