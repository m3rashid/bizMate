'use client';

import { CalendarParamsReturnType, CalendarViewType, defaultToday } from './calendarHelpers';
import { CalendarEvent } from '@/utils/types';
import { addWeeks } from 'date-fns';
import { MouseEvent, useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';

export type CalendarGlobalState = CalendarParamsReturnType & {
	hour: number;
	minute: number;
	addEditModalOpen: boolean;
	editEvent: CalendarEvent | null;
};

const calendarDefaultState: CalendarGlobalState = {
	hour: 0,
	minute: 0,
	editEvent: null,
	addEditModalOpen: false,
	...defaultToday,
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
		setCalendar((prev) => ({ ...prev, view }));
	}

	function changeCalendarDay(day: number) {
		setCalendar((prev) => ({ ...prev, day: day }));
	}

	function changeCalendarMonth(month: number) {
		setCalendar((prev) => ({ ...prev, month: month }));
	}

	function previousMonth() {
		setCalendar((prev) => ({
			...prev,
			month: prev.month === 0 ? 11 : prev.month - 1,
			year: prev.month === 0 ? prev.year - 1 : prev.year,
		}));
	}

	function nextMonth() {
		setCalendar((prev) => ({
			...prev,
			month: prev.month === 11 ? 0 : prev.month + 1,
			year: prev.month === 11 ? prev.year + 1 : prev.year,
		}));
	}

	function previousWeek() {
		setCalendar((prev) => {
			const newDate = addWeeks(new Date(prev.year, prev.month, prev.day), -1);
			return { ...prev, year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate() };
		});
	}

	function nextWeek() {
		setCalendar((prev) => {
			const newDate = addWeeks(new Date(prev.year, prev.month, prev.day), 1);
			return { ...prev, year: newDate.getFullYear(), month: newDate.getMonth(), day: newDate.getDate() };
		});
	}

	function previousYear() {
		setCalendar((prev) => ({ ...prev, year: prev.year - 1 }));
	}

	function nextYear() {
		setCalendar((prev) => ({ ...prev, year: prev.year + 1 }));
	}

	function previousDay() {
		setCalendar((prev) => ({
			...prev,
			day: prev.day === 1 ? 31 : prev.day - 1,
			month: prev.day === 1 ? prev.month - 1 : prev.month,
			year: prev.day === 1 ? prev.year : prev.year,
		}));
	}

	function nextDay() {
		setCalendar((prev) => ({
			...prev,
			day: prev.day === 31 ? 1 : prev.day + 1,
			month: prev.day === 31 ? prev.month + 1 : prev.month,
			year: prev.day === 31 ? prev.year : prev.year,
		}));
	}

	function changeCalendarWeek(week: number) {
		setCalendar((prev) => ({ ...prev, week: week }));
	}

	function changeCalendarYear(year: number) {
		setCalendar((prev) => ({ ...prev, year: year }));
	}

	function getActiveDate() {
		const date = new Date(calendar.year, calendar.month, calendar.day, calendar.hour, calendar.minute);
		return date;
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const nexts: Record<CalendarViewType, () => void> = useMemo(() => ({ month: nextMonth, week: nextWeek, day: nextDay }), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const prevs: Record<CalendarViewType, () => void> = useMemo(() => ({ month: previousMonth, week: previousWeek, day: previousDay }), []);

	function handlePrevious(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		(prevs as any)[calendar.view]();
	}

	function handleNext(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		(nexts as any)[calendar.view]();
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
