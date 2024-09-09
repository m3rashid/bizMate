'use client';

import { daysOfWeek, getYearRange, months } from '@/components/lib/datePicker';
import { SingleSelectInput } from '@/components/lib/singleSelectInput';
import { useCalendar } from '@/hooks/calendar';
import { cn } from '@/utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';

export function SmallCalendar() {
	const { calendar, getActiveDate, changeCalendarYear, changeCalendarDay, previousMonth, changeCalendarMonth, nextMonth } = useCalendar();

	function renderDates() {
		const endDate = endOfWeek(endOfMonth(getActiveDate()));
		const startDate = startOfWeek(startOfMonth(getActiveDate()));
		const days = eachDayOfInterval({ start: startDate, end: endDate });

		return (
			<div className='grid grid-cols-7 gap-1'>
				{days.map((day) => (
					<div
						key={day.toString()}
						onClick={() => changeCalendarDay(day.getDate())}
						className={cn(
							'select-none rounded-full p-2 text-center',
							isToday(day) ? 'cursor-pointer ring-2 ring-primary' : '',
							isSameDay(day, getActiveDate()) ? 'bg-primaryLight text-white' : '',
							isSameMonth(day, getActiveDate()) ? 'cursor-pointer text-gray-800 hover:bg-primaryLight' : 'text-gray-400'
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
			<div className='mb-3 flex items-center justify-between py-2'>
				<button
					onClick={(e) => {
						e.preventDefault();
						previousMonth();
					}}
					className='h-6 cursor-pointer rounded-md p-1 outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary'
				>
					<ChevronLeftIcon className='h-4 w-4 text-gray-400' />
				</button>

				<div className='mx-2 flex items-center justify-center gap-1'>
					<SingleSelectInput
						options={months}
						buttonClassName='min-h-6 py-0.5'
						value={months[calendar.activeMonth]}
						onChange={(newMonth) => changeCalendarMonth(months.findIndex((month) => month === newMonth))}
					/>

					<SingleSelectInput
						options={getYearRange()}
						buttonClassName='min-h-6 py-0.5'
						value={calendar.activeYear.toString()}
						onChange={(nextYear) => changeCalendarYear(parseInt(nextYear, 10))}
					/>
				</div>

				<button
					onClick={(e) => {
						e.preventDefault();
						nextMonth();
					}}
					className='h-6 cursor-pointer rounded-md p-1 outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary'
				>
					<ChevronRightIcon className='h-4 w-4 text-gray-400' />
				</button>
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
