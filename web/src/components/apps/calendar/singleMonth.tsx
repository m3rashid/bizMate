'use client';

import { useCalendar } from '@/hooks/calendar';
import { cn } from '@/utils/helpers';
import { addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { MouseEvent } from 'react';

export type SingleMonthCalendarProps = {};

export function SingleMonthCalendar(props: SingleMonthCalendarProps) {
	const { getActiveDate, changeCalendarDay, setCalendar } = useCalendar();

	const days = eachDayOfInterval({
		start: startOfWeek(startOfMonth(getActiveDate())),
		end: endOfWeek(endOfMonth(getActiveDate())),
	});

	const daysInWeek = eachDayOfInterval({
		start: startOfWeek(getActiveDate()),
		end: addWeeks(getActiveDate(), 1),
	}).slice(0, 7);

	function handleClick(e: MouseEvent<HTMLDivElement>, date: Date) {
		e.stopPropagation();
		setCalendar((prev) => ({
			...prev,
			addEditModalOpen: true,
			day: date.getDate(),
			month: date.getMonth(),
			year: date.getFullYear(),
		}));
	}

	return (
		<div className='grid-rows-24 relative grid grid-cols-7 pb-12'>
			{daysInWeek.map((day) => {
				return (
					<div key={day.toString()} className='col-span-1 flex flex-col items-center justify-center gap-1 pb-2 text-center'>
						<h3 className='font-semibold'>{format(day, 'EEE')}</h3>
					</div>
				);
			})}

			{days.map((day) => {
				return (
					<div
						key={day.toString()}
						onClick={(e) => handleClick(e, day)}
						className={cn(
							'h-48 cursor-pointer select-none rounded-md border-b border-r border-disabledLight',
							isSameDay(day, new Date()) ? 'border-2 border-primary' : '',
							isSameMonth(day, getActiveDate()) ? 'hover:bg-primaryLight' : 'pointer-events-none cursor-default rounded-none bg-gray-100'
						)}
					>
						<div className='p-2'>{isSameMonth(day, getActiveDate()) ? format(day, 'd') : ''}</div>
					</div>
				);
			})}
		</div>
	);
}
