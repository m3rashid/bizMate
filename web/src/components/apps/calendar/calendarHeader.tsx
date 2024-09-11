'use client';

import { Button } from '@/components/lib/button';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { useCalendar } from '@/hooks/calendar';
import { calendarViewTypes } from '@/hooks/calendarHelpers';
import { toSentenceCase } from '@/utils/helpers';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';

export function CalendarHeader() {
	const { openAddEditModal, calendar, changeCalendarView, handleNext, handlePrevious } = useCalendar();

	return (
		<div className='flex flex-col items-center justify-between gap-4 p-2 sm:flex-row sm:p-3'>
			<h1 className='text-xl font-semibold'>Calendar events</h1>

			<div className='flex items-center gap-2'>
				<div className='flex items-center justify-between gap-4 rounded-md px-2 py-1 ring-1 ring-disabledLight'>
					<button onClick={handlePrevious} className='h-6 cursor-pointer rounded-md p-1 outline-none'>
						<ChevronLeftIcon className='h-4 w-4 text-gray-600' />
					</button>

					<button onClick={handleNext} className='h-6 cursor-pointer rounded-md p-1 outline-none'>
						<ChevronRightIcon className='h-4 w-4 text-gray-600' />
					</button>
				</div>

				<SingleSelectInput
					buttonClassName='min-h-7 max-h-[34px]'
					value={calendar.view}
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
