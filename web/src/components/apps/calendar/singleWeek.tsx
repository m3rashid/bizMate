'use client';

import { useCalendar } from '@/hooks/calendar';

export type SingleWeekCalendarProps = {};

export function SingleWeekCalendar(props: SingleWeekCalendarProps) {
	const { calendar } = useCalendar();

	return (
		<div>
			{/* header showing the week */}
			<div className=''>{calendar.activeWeek}</div>

			{/* list of events */}
			{/* button to add a new event */}
		</div>
	);
}
