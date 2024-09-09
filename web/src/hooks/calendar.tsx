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
};

const calendarDefaultState: CalendarGlobalState = {
	addEditModalOpen: false,
	activeDay: defaultToday.day,
	activeYear: defaultToday.year,
	activeMonth: defaultToday.month,
	activeWeek: defaultToday.week,
	currentView: defaultToday.view,
	editEvent: null,
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

	function changeCalendarWeek(week: number) {
		setCalendar((prev) => ({ ...prev, activeWeek: week }));
	}

	function changeCalendarYear(year: number) {
		setCalendar((prev) => ({ ...prev, activeYear: year }));
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
	};
}
