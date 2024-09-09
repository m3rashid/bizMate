'use client';

import { useCalendar } from '@/hooks/calendar';

export type SingleDayCalendarProps = {};

export function SingleDayCalendar(props: SingleDayCalendarProps) {
	const { calendar } = useCalendar();

	return (
		<div>
			{/* header showing the date */}
			<div className=''>{calendar.activeDay}</div>

			{/* list of events */}
			{/* button to add a new event */}
		</div>
	);
}
