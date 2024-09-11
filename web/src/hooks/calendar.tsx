'use client';

import { CalendarParamsReturnType, CalendarViewType, defaultToday } from './calendarHelpers';
import { CalendarEvent } from '@/utils/types';
import { addWeeks } from 'date-fns';
import { MouseEvent, useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';

export type CalendarGlobalState = {
	addEditModalOpen: boolean;
	activeDay: number;
	activeYear: number;
	activeMonth: number;
	activeWeek: number;
	currentView: CalendarViewType;
	editEvent: CalendarEvent | null;
	activeHour: number;
	activeMinute: number;
};

const calendarDefaultState: CalendarGlobalState = {
	addEditModalOpen: false,
	activeDay: defaultToday.day,
	activeYear: defaultToday.year,
	activeMonth: defaultToday.month,
	activeWeek: defaultToday.week,
	currentView: defaultToday.view,
	editEvent: null,
	activeHour: 0,
	activeMinute: 0,
};

const calendarAtom = atom<CalendarGlobalState>({
	key: 'calendarAtom',
	default: calendarDefaultState,
});

export function useCalendar() {
	const [calendar, setCalendar] = useRecoilState(calendarAtom);

	function initializeCalendar(params: CalendarParamsReturnType) {
		setCalendar((prev) => ({
			...prev,
			activeDay: params.day,
			activeMonth: params.month,
			activeWeek: params.week,
			activeYear: params.year,
			currentView: params.view,
		}));
	}

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
		setCalendar((prev) => ({ ...prev, currentView: view }));
	}

	function changeCalendarDay(day: number) {
		setCalendar((prev) => ({ ...prev, activeDay: day }));
	}

	function changeCalendarMonth(month: number) {
		setCalendar((prev) => ({ ...prev, activeMonth: month }));
	}

	function previousMonth() {
		setCalendar((prev) => {
			const newMonth = prev.activeMonth === 0 ? 11 : prev.activeMonth - 1;
			const newYear = prev.activeMonth === 0 ? prev.activeYear - 1 : prev.activeYear;
			return { ...prev, activeMonth: newMonth, activeYear: newYear };
		});
	}

	function nextMonth() {
		setCalendar((prev) => {
			const newMonth = prev.activeMonth === 11 ? 0 : prev.activeMonth + 1;
			const newYear = prev.activeMonth === 11 ? prev.activeYear + 1 : prev.activeYear;
			return { ...prev, activeMonth: newMonth, activeYear: newYear };
		});
	}

	function previousWeek() {
		setCalendar((prev) => {
			const newDate = addWeeks(new Date(prev.activeYear, prev.activeMonth, prev.activeDay), -1);
			return { ...prev, activeYear: newDate.getFullYear(), activeMonth: newDate.getMonth(), activeDay: newDate.getDate() };
		});
	}

	function nextWeek() {
		setCalendar((prev) => {
			const newDate = addWeeks(new Date(prev.activeYear, prev.activeMonth, prev.activeDay), 1);
			return { ...prev, activeYear: newDate.getFullYear(), activeMonth: newDate.getMonth(), activeDay: newDate.getDate() };
		});
	}

	function previousYear() {
		setCalendar((prev) => ({ ...prev, activeYear: prev.activeYear - 1 }));
	}

	function nextYear() {
		setCalendar((prev) => ({ ...prev, activeYear: prev.activeYear + 1 }));
	}

	function previousDay() {
		setCalendar((prev) => {
			const newDay = prev.activeDay === 1 ? 31 : prev.activeDay - 1;
			const newMonth = prev.activeDay === 1 ? prev.activeMonth - 1 : prev.activeMonth;
			const newYear = prev.activeDay === 1 ? prev.activeYear : prev.activeYear;
			return { ...prev, activeDay: newDay, activeMonth: newMonth, activeYear: newYear };
		});
	}

	function nextDay() {
		setCalendar((prev) => {
			const newDay = prev.activeDay === 31 ? 1 : prev.activeDay + 1;
			const newMonth = prev.activeDay === 31 ? prev.activeMonth + 1 : prev.activeMonth;
			const newYear = prev.activeDay === 31 ? prev.activeYear : prev.activeYear;
			return { ...prev, activeDay: newDay, activeMonth: newMonth, activeYear: newYear };
		});
	}

	function changeCalendarWeek(week: number) {
		setCalendar((prev) => ({ ...prev, activeWeek: week }));
	}

	function changeCalendarYear(year: number) {
		setCalendar((prev) => ({ ...prev, activeYear: year }));
	}

	function getActiveDate() {
		const date = new Date(calendar.activeYear, calendar.activeMonth, calendar.activeDay, calendar.activeHour, calendar.activeMinute);
		return date;
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const nexts: Record<CalendarViewType, () => void> = useMemo(() => ({ month: nextMonth, week: nextWeek, day: nextDay }), []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const prevs: Record<CalendarViewType, () => void> = useMemo(() => ({ month: previousMonth, week: previousWeek, day: previousDay }), []);

	function handlePrevious(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		prevs[calendar.currentView]();
	}

	function handleNext(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		nexts[calendar.currentView]();
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
		initializeCalendar,
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
