'use client';

import { CalendarParamsReturnType, CalendarViewType, defaultToday } from './calendarHelpers';
import { CalendarEvent } from '@/utils/types';
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
	};
}
