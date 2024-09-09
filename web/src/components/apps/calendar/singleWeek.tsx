'use client';

import { useCalendar } from '@/hooks/calendar';
import { cn } from '@/utils/helpers';
import { addWeeks, eachDayOfInterval, format, isSameDay, startOfWeek } from 'date-fns';
import { MouseEvent } from 'react';

export type SingleWeekCalendarProps = {};

const events = [
	{
		id: 1,
		title: 'Meeting',
		start: new Date('2024-09-08T00:00:00.004Z'), // 10 AM
		end: new Date('2024-09-08T02:00:00.000Z'), // 12 PM
		day: 1, // Monday
	},
	{
		id: 2,
		title: 'Workshop',
		start: new Date('2024-09-10T14:00:00'), // 2 PM
		end: new Date('2024-09-11T11:00:00'), // Spanning over 2 days
		day: 2, // Tuesday
	},
];

const getTimeDiffInHours = (start: any, end: any) => {
	return (end - start) / (1000 * 60 * 60);
};

const hourHeight = 36.9;
const maxBoxHeight = 24 * hourHeight;
const dayWidth = 100 / 7;

const getEventStyles = (event: (typeof events)[number]) => {
	const startHour = event.start.getHours() + event.start.getMinutes() / 60;
	const durationHours = getTimeDiffInHours(event.start, event.end);

	const eventDay = event.start.getDay();

	const top = Math.min(startHour * hourHeight, maxBoxHeight);
	const actualHeight = hourHeight * durationHours;
	return {
		top: `${top}px`,
		width: `${dayWidth}%`,
		left: `${eventDay * dayWidth}%`,
		height: `${Math.min(actualHeight, maxBoxHeight - top)}px`,
	};
};

export function SingleWeekCalendar(props: SingleWeekCalendarProps) {
	const { getActiveDate, changeCalendarDay, setCalendar } = useCalendar();

	const daysInWeek = eachDayOfInterval({
		start: startOfWeek(getActiveDate()),
		end: addWeeks(getActiveDate(), 1),
	}).slice(0, 7);

	function handleClick(e: MouseEvent<HTMLDivElement>, hour: number) {
		e.stopPropagation();
		const target = e.target as HTMLDivElement;
		const bounds = target.getBoundingClientRect();
		const clickX = e.clientX - bounds.left;

		const dayOfWeek = Math.floor(clickX / (bounds.width / 7));
		const day = daysInWeek[dayOfWeek].getDate();
		setCalendar((prev) => ({ ...prev, activeDay: day, activeHour: hour, activeMinute: 0, addEditModalOpen: true }));
	}

	return (
		<div className='grid-rows-24 relative ml-14 grid grid-cols-7 pb-12'>
			{daysInWeek.map((day) => {
				return (
					<div key={day.toString()} className='col-span-1 flex flex-col items-center justify-center gap-1 pb-2 text-center'>
						<h3 className='font-semibold' onClick={() => changeCalendarDay(day.getDate())}>
							{format(day, 'EEE')}
						</h3>
						<div
							onClick={() => changeCalendarDay(day.getDate())}
							className={cn(
								'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ring-1 hover:bg-primaryLight',
								isSameDay(day, getActiveDate()) ? 'bg-primary text-white ring-primary' : 'ring-disabled hover:ring-primaryLight'
							)}
						>
							{format(day, 'd')}
						</div>
					</div>
				);
			})}

			{[...Array(24)].map((_, hour) => (
				<div
					key={hour}
					onClick={(e) => handleClick(e, hour)}
					className='col-span-7 row-span-1 -ml-14 box-border border-t px-2 py-2.5 text-xs text-disabled'
				>
					{`${hour}:00`}
				</div>
			))}

			{events.map((event) => (
				<div key={event.id} className='absolute rounded bg-blue-400 p-2 text-white' style={getEventStyles(event)}>
					{event.title}
				</div>
			))}
		</div>
	);
}
