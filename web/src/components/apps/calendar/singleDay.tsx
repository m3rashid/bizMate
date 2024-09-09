'use client';

import { useCalendar } from '@/hooks/calendar';
import { format } from 'date-fns';
import { MouseEvent } from 'react';

export type SingleDayCalendarProps = {};

export function SingleDayCalendar(props: SingleDayCalendarProps) {
	const { getActiveDate } = useCalendar();

	function handleClick(e: MouseEvent<HTMLDivElement>, hour: number) {
		e.stopPropagation();
	}

	return (
		<div className='grid-rows-24 relative ml-14 pb-12'>
			<div className='flex items-center gap-2 pb-2'>
				<div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white'>{format(getActiveDate(), 'd')}</div>
				<h3 className='font-semibold'>{format(getActiveDate(), 'EEEE, dd MMMM yyyy')}</h3>
			</div>

			{[...Array(24)].map((_, hour) => (
				<div
					key={hour}
					onClick={(e) => handleClick(e, hour)}
					className='col-span-7 row-span-1 -ml-14 box-border border-t px-2 py-2.5 text-xs text-disabled'
				>
					{`${hour}:00`}
				</div>
			))}
		</div>
	);
}
