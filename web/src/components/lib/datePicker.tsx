'use client';

import { SingleSelectInput } from './singleSelectInput';
import { cn } from '@/utils/helpers';
import { Listbox, ListboxButton, ListboxOptions, Transition } from '@headlessui/react';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay } from 'date-fns';
import React, { Fragment, useReducer } from 'react';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getYearRange() {
	const currentYear = new Date().getFullYear();
	const endYear = currentYear + 40;
	const startYear = currentYear - 60;
	const years: string[] = [];
	for (let i = startYear; i <= endYear; i++) years.push(i.toString());
	return years;
}

type State = {
	currentMonth: Date;
	selectedDate: Date;
	currentYearValue: string;
	currentMonthValue: string;
};

const initialState: State = {
	currentMonth: new Date(),
	selectedDate: new Date(),
	currentMonthValue: months[new Date().getMonth()],
	currentYearValue: new Date().getFullYear().toString(),
};

type Action =
	| { type: 'NEXT_MONTH' }
	| { type: 'PREVIOUS_MONTH' }
	| { type: 'CHANGE_MONTH'; month: string }
	| { type: 'CHANGE_YEAR'; year: string }
	| { type: 'SELECT_DATE'; date: Date };

function datePickerReducer(state: State, action: Action): State {
	if (action.type === 'NEXT_MONTH') {
		const nextMonth = addMonths(state.currentMonth, 1);
		return {
			...state,
			currentMonth: nextMonth,
			currentMonthValue: months[nextMonth.getMonth()],
			currentYearValue: nextMonth.getFullYear().toString(),
		};
	} else if (action.type === 'PREVIOUS_MONTH') {
		const previousMonth = addMonths(state.currentMonth, -1);
		return {
			...state,
			currentMonth: previousMonth,
			currentMonthValue: months[previousMonth.getMonth()],
			currentYearValue: previousMonth.getFullYear().toString(),
		};
	} else if (action.type === 'CHANGE_MONTH') {
		const newMonth = months.indexOf(action.month);
		const newDate = new Date(state.currentMonth.setMonth(newMonth));
		return {
			...state,
			currentMonth: newDate,
			currentMonthValue: months[newDate.getMonth()],
		};
	} else if (action.type === 'CHANGE_YEAR') {
		const newYear = parseInt(action.year);
		const newDate = new Date(state.currentMonth.setFullYear(newYear));
		return {
			...state,
			currentMonth: newDate,
			currentYearValue: newYear.toString(),
			currentMonthValue: months[newDate.getMonth()],
		};
	} else if (action.type === 'SELECT_DATE') {
		return { ...state, selectedDate: action.date };
	}
	return state;
}

export type DatePickerProps = {
	name: string;
	className?: string;
	label?: string;

	value?: string;

	errorText?: string;
	required?: boolean;
	labelClassName?: string;
	descriptionText?: string;
};

export const DatePicker = (props: DatePickerProps) => {
	const [state, dispatch] = useReducer(datePickerReducer, initialState);

	function renderDates() {
		const endDate = endOfWeek(endOfMonth(state.currentMonth));
		const startDate = startOfWeek(startOfMonth(state.currentMonth));
		const days = eachDayOfInterval({ start: startDate, end: endDate });

		return (
			<div className='grid grid-cols-7 gap-1'>
				{days.map((day) => (
					<div
						key={day.toString()}
						onClick={() => dispatch({ type: 'SELECT_DATE', date: day })}
						className={cn(
							'select-none rounded-full p-2 text-center',
							isToday(day) ? 'cursor-pointer ring-2 ring-primary' : '',
							isSameDay(day, state.selectedDate) ? 'bg-primary text-white' : '',
							isSameMonth(day, state.currentMonth) ? 'cursor-pointer hover:bg-primaryLight' : 'text-gray-400'
						)}
					>
						{format(day, 'd')}
					</div>
				))}
			</div>
		);
	}

	return (
		<Listbox name={props.name} value={format(state.selectedDate, 'yyyy-MM-dd')}>
			{({ open }) => (
				<div className={props.className}>
					{props.label ? (
						<label htmlFor={props.name} className={cn('block text-sm font-medium leading-6 text-gray-900', props.labelClassName)}>
							{props.label}&nbsp;
							<span className='text-red-500'>{props.required ? '*' : ''}</span>
						</label>
					) : null}

					{props.errorText ? <p className='mt-1 text-sm text-red-500'>{props.errorText}</p> : null}

					<div className='relative w-full'>
						<ListboxButton className='relative w-full rounded-md shadow-sm'>
							<div className='block w-full rounded-md border-0 px-3 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-disabled sm:text-sm sm:leading-6'>
								{format(state.selectedDate, 'EEEE dd MMM - yyyy')}
							</div>

							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
								<CalendarDaysIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
							</div>
						</ListboxButton>

						<Transition show={open} as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
							<ListboxOptions className='absolute z-10 mt-1 w-fit min-w-[100px] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
								<div className={cn('h-fit w-fit bg-white p-2 sm:p-3', props.className)}>
									{/* header */}
									<div className='mb-3 flex items-center justify-between py-2'>
										<button
											onClick={(e) => {
												e.preventDefault();
												dispatch({ type: 'PREVIOUS_MONTH' });
											}}
											className='h-6 cursor-pointer rounded-md p-1 outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary'
										>
											<ChevronLeftIcon className='h-4 w-4 text-gray-400' />
										</button>

										<div className='mx-2 flex items-center justify-center gap-1'>
											<SingleSelectInput
												options={months}
												value={state.currentMonthValue}
												buttonClassName='min-h-6 py-0.5'
												onChange={(newMonth) => dispatch({ type: 'CHANGE_MONTH', month: newMonth })}
											/>

											<SingleSelectInput
												options={getYearRange()}
												value={state.currentYearValue}
												buttonClassName='min-h-6 py-0.5'
												onChange={(nextYear) => dispatch({ type: 'CHANGE_YEAR', year: nextYear })}
											/>
										</div>

										<button
											onClick={(e) => {
												e.preventDefault();
												dispatch({ type: 'NEXT_MONTH' });
											}}
											className='h-6 cursor-pointer rounded-md p-1 outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary'
										>
											<ChevronRightIcon className='h-4 w-4 text-gray-400' />
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
							</ListboxOptions>
						</Transition>
					</div>
				</div>
			)}
		</Listbox>
	);
};
