'use client';

import { CalendarParamsReturnType, CalendarViewType, defaultToday } from './calendarHelpers';
import { useSearchParams } from './searchParams';
import { CalendarEvent } from '@/utils/types';
import { addWeeks } from 'date-fns';
import { MouseEvent, useEffect, useMemo, useTransition } from 'react';
import { atom, useRecoilState } from 'recoil';

export type CalendarGlobalState = {
	addEditModalOpen: boolean;
	editEvent: CalendarEvent | null;
	hour: number;
	minute: number;
	initialized: boolean;
};

const calendarDefaultState: CalendarGlobalState = {
	addEditModalOpen: false,
	editEvent: null,
	hour: 0,
	minute: 0,
	initialized: false,
};

const calendarAtom = atom<CalendarGlobalState>({
	key: 'calendarAtom',
	default: calendarDefaultState,
});

export type UseCalendarProps = {
	initParams?: CalendarParamsReturnType;
};

export function useCalendar(props?: UseCalendarProps) {
	const [calendar, setCalendar] = useRecoilState(calendarAtom);
	// const [isPending, startTransition] = useTransition()
	const { searchParams, init, updateSearchParams } = useSearchParams();

	useEffect(() => {
		if (calendar.initialized) return;
		init(props?.initParams || defaultToday);
		setCalendar((prev) => ({ ...prev, initialized: true }));
		console.log('Calendar initialized');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function setEditEvent(event: CalendarEvent) {
		setCalendar((prev) => ({ ...prev, editEvent: event, addEditModalOpen: true }));
	}

	function clearEditEvent() {
		setCalendar((prev) => ({ ...prev, editEvent: null, addEditModalOpen: false }));
	}

	function openAddEditModal() {
		setCalendar((prev) => ({ ...prev, addEditModalOpen: true }));
	}

	function closeAddEditModal() {
		setCalendar((prev) => ({ ...prev, addEditModalOpen: false }));
	}

	function resetCalendar() {
		setCalendar(calendarDefaultState);
	}

	function changeCalendarView(view: CalendarViewType) {
		updateSearchParams({ view });
	}

	function changeCalendarDay(day: number) {
		setCalendar((prev) => ({ ...prev, day: day }));
	}

	function changeCalendarMonth(month: number) {
		setCalendar((prev) => ({ ...prev, month: month }));
	}

	function previousMonth() {
		updateSearchParams({
			month: searchParams.month === 0 ? 11 : searchParams.month - 1,
			year: searchParams.month === 0 ? searchParams.year - 1 : searchParams.year,
		});
	}

	function nextMonth() {
		updateSearchParams({
			month: searchParams.month === 11 ? 0 : searchParams.month + 1,
			year: searchParams.month === 11 ? searchParams.year + 1 : searchParams.year,
		});
	}

	function previousWeek() {
		const newDate = addWeeks(new Date(searchParams.year, searchParams.month, searchParams.day), -1);
		updateSearchParams({ year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate() });
	}

	function nextWeek() {
		const newDate = addWeeks(new Date(searchParams.year, searchParams.month, searchParams.day), 1);
		updateSearchParams({ year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate() });
	}

	function previousYear() {
		updateSearchParams({ year: searchParams.year - 1 });
	}

	function nextYear() {
		updateSearchParams({ year: searchParams.year + 1 });
	}

	function previousDay() {
		const newDay = searchParams.day === 1 ? 31 : searchParams.day - 1;
		const newMonth = searchParams.day === 1 ? searchParams.month - 1 : searchParams.month;
		const newYear = searchParams.day === 1 ? searchParams.year : searchParams.year;
		updateSearchParams({ day: newDay, month: newMonth, year: newYear });
	}

	function nextDay() {
		const newDay = searchParams.day === 31 ? 1 : searchParams.day + 1;
		const newMonth = searchParams.day === 31 ? searchParams.month + 1 : searchParams.month;
		const newYear = searchParams.day === 31 ? searchParams.year : searchParams.year;
		updateSearchParams({ day: newDay, month: newMonth, year: newYear });
	}

	function changeCalendarWeek(week: number) {
		setCalendar((prev) => ({ ...prev, week: week }));
	}

	function changeCalendarYear(year: number) {
		setCalendar((prev) => ({ ...prev, year: year }));
	}

	function getActiveDate() {
		if (!searchParams) {
			// console.log("No search params found, using today's date");
			return new Date();
		}
		const date = new Date(searchParams.year, searchParams.month, searchParams.day, searchParams.hour, searchParams.minute);
		return date;
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const nexts: Record<CalendarViewType, () => void> = useMemo(() => ({ month: nextMonth, week: nextWeek, day: nextDay }), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const prevs: Record<CalendarViewType, () => void> = useMemo(() => ({ month: previousMonth, week: previousWeek, day: previousDay }), []);

	function handlePrevious(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		(prevs as any)[searchParams.view]();
	}

	function handleNext(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		(nexts as any)[searchParams.view]();
	}

	return {
		calendar,
		setCalendar,
		changeCalendarDay,
		changeCalendarMonth,
		changeCalendarWeek,
		changeCalendarYear,
		changeCalendarView,
		resetCalendar,
		openAddEditModal,
		closeAddEditModal,
		setEditEvent,
		clearEditEvent,
		getActiveDate,
		previousMonth,
		nextMonth,
		previousWeek,
		nextWeek,
		previousYear,
		nextYear,
		previousDay,
		nextDay,
		nexts,
		prevs,
		handlePrevious,
		handleNext,
	};
}
