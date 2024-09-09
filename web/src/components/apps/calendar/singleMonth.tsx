'use client';

import { useCalendar } from '@/hooks/calendar';

export type SingleMonthCalendarProps = {};

export function SingleMonthCalendar(props: SingleMonthCalendarProps) {
	const { calendar } = useCalendar();

	return (
		<div className=''>
			<div className=''>{calendar.activeMonth}</div>
		</div>
	);
}
