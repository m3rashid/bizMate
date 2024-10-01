'use client';

import { daysOfWeek, months } from '@/components/lib/datePicker';
import { useCalendar } from '@/hooks/calendar';
import { cn } from '@/utils/helpers';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';

export function SmallCalendar() {
	const { calendar, getActiveDate, changeCalendarDay, previousMonth, nextMonth } = useCalendar();

	function renderDates() {
		const days = eachDayOfInterval({
			start: startOfWeek(startOfMonth(getActiveDate())),
			end: endOfWeek(endOfMonth(getActiveDate())),
		});

		return (
			<div className='grid grid-cols-7 gap-1'>
				{days.map((day) => (
					<div
						key={day.toString()}
						onClick={() => changeCalendarDay(day.getDate())}
						className={cn(
							'my-1 flex h-8 w-8 select-none items-center justify-center rounded-full text-center ring-2 ring-white',
							isSameMonth(day, getActiveDate()) ? 'cursor-pointer text-gray-800 hover:bg-primaryLight hover:ring-primaryLight' : 'text-gray-400',
							isSameDay(day, getActiveDate()) ? 'bg-primary text-white' : '',
							isToday(day) ? 'cursor-pointer ring-primary' : ''
						)}
					>
						{format(day, 'd')}
					</div>
				))}
			</div>
		);
	}

	return (
		<div className='h-fit w-full bg-white'>
			<div className='flex items-center justify-between py-2'>
				<div className='mx-2 flex items-center justify-center gap-1 font-semibold'>{`${months[calendar.month]} ${calendar.year}`}</div>

				<div className='flex items-center justify-between gap-4'>
					<button onClick={previousMonth} className='h-6 cursor-pointer rounded-md p-1 outline-none focus:ring-2 focus:ring-primary'>
						<ChevronLeftIcon className='h-4 w-4 text-gray-600' />
					</button>

					<button onClick={nextMonth} className='h-6 cursor-pointer rounded-md p-1 outline-none focus:ring-2 focus:ring-primary'>
						<ChevronRightIcon className='h-4 w-4 text-gray-600' />
					</button>
				</div>
			</div>

			<div className='grid grid-cols-7 text-center text-gray-400'>
				{daysOfWeek.map((day) => (
					<div key={day} className='py-2'>
						{day}
					</div>
				))}
			</div>
			{renderDates()}
		</div>
	);
}
