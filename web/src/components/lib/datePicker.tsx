'use client';

import { SingleSelectInput } from './singleSelectInput';
import { cn } from '@/utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday } from 'date-fns';
import React, { useState } from 'react';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getYearRange() {
	const currentYear = new Date().getFullYear();
	const startYear = currentYear - 40;
	const endYear = currentYear + 40;
	const years: string[] = [];
	for (let i = startYear; i <= endYear; i++) {
		years.push(i.toString());
	}
	return years;
}

export const DatePicker: React.FC = () => {
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const renderDates = () => {
		const startDate = startOfWeek(startOfMonth(currentMonth));
		const endDate = endOfWeek(endOfMonth(currentMonth));
		const days = eachDayOfInterval({ start: startDate, end: endDate });

		return (
			<div className='grid grid-cols-7 gap-1'>
				{days.map((day) => (
					<div
						key={day.toString()}
						onClick={() => setSelectedDate(day)}
						className={cn(
							'rounded-full p-2 text-center',
							isSameMonth(day, currentMonth)
								? isToday(day)
									? 'cursor-pointer bg-primary text-white'
									: 'cursor-pointer hover:bg-primaryLight'
								: 'text-gray-400'
						)}
					>
						{format(day, 'd')}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className='flex h-fit w-fit items-center justify-center'>
			<div className='rounded-lg bg-white p-4 shadow-lg'>
				{/* header */}
				<div className='flex items-center justify-between py-2'>
					<button
						onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
						className='cursor-pointer rounded-md p-1 outline-none ring-2 ring-disabled'
					>
						<ChevronLeftIcon className='h-4 w-4' />
					</button>

					<div className='flex items-center justify-center gap-1'>
						<SingleSelectInput
							options={months}
							value={months[currentMonth.getMonth()]}
							onChange={(newMonth) => {
								setSelectedDate(new Date(selectedDate.setMonth(months.indexOf(newMonth))));
								setCurrentMonth(new Date(currentMonth.setMonth(months.indexOf(newMonth))));
							}}
						/>

						<SingleSelectInput
							options={getYearRange()}
							value={selectedDate.getFullYear().toString()}
							onChange={(newYear) => {
								setSelectedDate(new Date(selectedDate.setFullYear(parseInt(newYear))));
								setCurrentMonth(new Date(currentMonth.setFullYear(parseInt(newYear))));
							}}
						/>
					</div>

					<button
						onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
						className='cursor-pointer rounded-md p-1 outline-none ring-2 ring-disabled'
					>
						<ChevronRightIcon className='h-4 w-4' />
					</button>
				</div>

				{/* day of the week */}
				<div className='grid grid-cols-7 text-center text-gray-400'>
					{daysOfWeek.map((day) => (
						<div key={day} className='py-2'>
							{day}
						</div>
					))}
				</div>

				{renderDates()}
			</div>
		</div>
	);
};
