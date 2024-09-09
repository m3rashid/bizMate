'use client';

import { SingleSelectInput } from './singleSelectInput';
import { cn } from '@/utils/helpers';
import { Listbox, ListboxButton, ListboxOptions, Transition } from '@headlessui/react';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay } from 'date-fns';
import React, { Fragment, useReducer } from 'react';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const minutes = Array.from({ length: 60 }, (_, i) => i.toFixed().padStart(2, '0'));
const hours24 = Array.from({ length: 24 }, (_, i) => i.toFixed().padStart(2, '0'));
const hours12 = Array.from({ length: 12 }, (_, i) => i.toFixed().padStart(2, '0'));

const am_pm = ['AM', 'PM'] as const;
type AmPm = (typeof am_pm)[number];

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
	selectedHour: string;
	selectedMinute: string;
	selectedAmPm: AmPm;
};

const initialState: State = {
	currentMonth: new Date(),
	selectedDate: new Date(),
	currentMonthValue: months[new Date().getMonth()],
	currentYearValue: new Date().getFullYear().toString(),
	selectedHour: '00',
	selectedMinute: '00',
	selectedAmPm: 'AM',
};

type Action =
	| { type: 'NEXT_MONTH' }
	| { type: 'PREVIOUS_MONTH' }
	| { type: 'CHANGE_MONTH'; month: string }
	| { type: 'CHANGE_YEAR'; year: string }
	| { type: 'SELECT_DATE'; date: Date }
	| { type: 'SELECT_HOUR'; hour: string }
	| { type: 'SELECT_MINUTE'; minute: string }
	| { type: 'SELECT_AM_PM'; value: AmPm };

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
	} else if (action.type === 'SELECT_HOUR') {
		const newDate = new Date(state.selectedDate);
		if (!isNaN(parseInt(action.hour, 10))) newDate.setHours(parseInt(action.hour, 10));
		return { ...state, selectedDate: newDate, selectedHour: action.hour };
	} else if (action.type === 'SELECT_MINUTE') {
		const newDate = new Date(state.selectedDate);
		if (!isNaN(parseInt(action.minute, 10))) newDate.setMinutes(parseInt(action.minute, 10));
		return { ...state, selectedDate: newDate, selectedMinute: action.minute };
	} else if (action.type === 'SELECT_AM_PM') {
		return { ...state, selectedAmPm: action.value };
	}
	return state;
}

export type DatePickerProps = {
	name: string;
	className?: string;
	label?: string;
	showTime?: boolean;
	hour24Clock?: boolean;

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
		<div className='flex items-end gap-1'>
			<Listbox name={props.name} value={state.selectedDate}>
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
								<ListboxOptions className='absolute z-10 mt-1 w-fit min-w-[300px] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
									<div className={cn('h-fit w-full bg-white p-2 sm:p-3', props.className)}>
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

			{props.showTime ? (
				<Listbox>
					{({ open }) => (
						<div className='relative min-w-28'>
							<ListboxButton className='relative rounded-md shadow-sm'>
								<div className='block rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-disabled sm:text-sm sm:leading-6'>
									{`${state.selectedHour}:${state.selectedMinute}${props.hour24Clock ? '' : ' ' + state.selectedAmPm}`}
								</div>
							</ListboxButton>

							<Transition show={open} as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
								<div
									className={cn(
										'absolute z-10 mt-1 flex w-fit select-none rounded-md bg-white px-3 py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
										props.hour24Clock ? 'w-32' : 'w-48'
									)}
								>
									<div className='flex max-h-64 flex-grow flex-col gap-1 overflow-hidden px-1 py-0 hover:overflow-auto'>
										{(props.hour24Clock ? hours24 : hours12).map((hour) => (
											<div
												key={`hour-${hour}`}
												onClick={() => dispatch({ type: 'SELECT_HOUR', hour })}
												className='cursor-pointer rounded-md px-1 py-0.5 text-center hover:bg-gray-200'
											>
												{hour}
											</div>
										))}
									</div>

									<div className='flex max-h-64 flex-grow flex-col gap-1 overflow-hidden px-1 py-0 hover:overflow-auto'>
										{minutes.map((minute) => (
											<div
												key={`minute-${minute}`}
												onClick={(e) => dispatch({ type: 'SELECT_MINUTE', minute })}
												className='cursor-pointer rounded-md px-1 py-0.5 text-center hover:bg-gray-200'
											>
												{minute}
											</div>
										))}
									</div>

									{!props.hour24Clock ? (
										<div className='flex max-h-64 flex-grow flex-col gap-1 px-1 py-0'>
											{am_pm.map((value) => (
												<div
													key={`ampm-${value}`}
													onClick={(e) => dispatch({ type: 'SELECT_AM_PM', value })}
													className='cursor-pointer rounded-md p-1 text-center hover:bg-gray-200'
												>
													{value}
												</div>
											))}
										</div>
									) : null}
								</div>
							</Transition>
						</div>
					)}
				</Listbox>
			) : null}
		</div>
	);
};
