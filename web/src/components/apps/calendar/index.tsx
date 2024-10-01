'use client';

import { AddEditEvent } from './addEditEvent';
import { CalendarHeader } from './calendarHeader';
import { FullSizeCalendar } from './fullCalendar';
import { LeftCalendarSidebar } from './leftCalendarSidebar';
import { Modal } from '@/components/lib/modal';
import { CalendarParamsReturnType } from '@/hooks/calendarHelpers';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export type FullSizeCalendarProps = CalendarParamsReturnType & {};

export function Calendar(params: CalendarParamsReturnType) {
	const [open, setOpen] = useState(true);
	return (
		<>
			<AddEditEvent />
			<CalendarHeader />

			<Modal open={open} setOpen={setOpen} title='Calendar is still in Beta' className='bg-danger text-white' titleClassName='text-white'>
				<div className='flex flex-col items-center justify-center gap-4 bg-white py-20 text-black'>
					<ExclamationTriangleIcon className='h-12 w-12 text-danger' />
					<p className='px-24 text-center text-xl text-danger'>Calendar is still in Beta, some features might not work now. Please be cautious !!</p>
				</div>
			</Modal>

			<div className='flex h-full flex-col gap-4 sm:flex-row'>
				<LeftCalendarSidebar />
				<FullSizeCalendar />
			</div>
		</>
	);
}
