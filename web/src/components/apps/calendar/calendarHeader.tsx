'use client';

import { Button } from '@/components/lib/button';
import { months } from '@/components/lib/datePicker';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { useCalendar } from '@/hooks/calendar';
import { calendarViewTypes } from '@/hooks/calendarHelpers';
import { toSentenceCase } from '@/utils/helpers';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';
import { isToday } from 'date-fns';

export function CalendarHeader() {
	const { openAddEditModal, calendar, changeCalendarView, handleNext, handlePrevious, resetCalendar, getActiveDate } = useCalendar();

	return (
		<div className='flex flex-col items-center justify-between gap-4 p-2 sm:flex-row sm:p-3'>
			<div className='flex flex-wrap items-center gap-4'>
				<h2 className='mr-4 text-xl font-semibold'>Calendar Events</h2>

				{!isToday(getActiveDate()) ? (
					<Button variant='simple' size='small' onClick={resetCalendar}>
						Today
					</Button>
				) : null}

				<h3 className='text-xl'>{`${months[calendar.month]} ${calendar.year}`}</h3>
			</div>

			<div className='flex items-center gap-4'>
				<div className='flex items-center justify-between gap-4 rounded-md px-2 py-1 ring-1 ring-disabledLight'>
					<button onClick={handlePrevious} className='h-6 cursor-pointer rounded-md p-1 outline-none'>
						<ChevronLeftIcon className='h-4 w-4 text-gray-600' />
					</button>

					<button onClick={handleNext} className='h-6 cursor-pointer rounded-md p-1 outline-none'>
						<ChevronRightIcon className='h-4 w-4 text-gray-600' />
					</button>
				</div>

				<SingleSelectInput
					value={calendar.view}
					buttonClassName='min-h-7 max-h-[34px]'
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
