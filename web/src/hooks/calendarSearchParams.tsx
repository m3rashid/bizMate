'use client';

import { CalendarParamsReturnType, calendarViewTypes, defaultToday } from './calendarHelpers';
import { safeParseNumber } from '@/utils/helpers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';

export const useCalendarSearchParams = () => {
	const router = useRouter();
	const path = usePathname();
	const [searchParams, setSearchParams] = useState<CalendarParamsReturnType>(defaultToday);
	const _params = useSearchParams();

	const getInitialUrlSearchParams = useCallback((initialParams: CalendarParamsReturnType) => {
		const urlSearchParams = new URLSearchParams(_params);
		let params: CalendarParamsReturnType = { ...(initialParams || {}) };

		if (urlSearchParams.has('year')) params.year = safeParseNumber(urlSearchParams.get('year')!, initialParams.year);
		if (urlSearchParams.has('month')) params.month = safeParseNumber(urlSearchParams.get('month')!, initialParams.month);
		if (urlSearchParams.has('week')) params.week = safeParseNumber(urlSearchParams.get('week')!, initialParams.week);
		if (urlSearchParams.has('day')) params.day = safeParseNumber(urlSearchParams.get('day')!, initialParams.day);
		if (urlSearchParams.has('view')) {
			const view = urlSearchParams.get('view');
			if (!calendarViewTypes.includes(view as any)) params.view = initialParams.view;
			params.view = view as any;
		}
		return params;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateSearchParams = useCallback(
		(newParams: Partial<CalendarParamsReturnType>) => {
			const updatedParams = { ...searchParams, ...newParams };
			const urlSearchParams = new URLSearchParams();
			for (const key in updatedParams) urlSearchParams.set(key, (updatedParams as any)[key].toString());
			setSearchParams(updatedParams);
			router.push(path + '?' + urlSearchParams.toString());
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchParams]
	);

	const removeSearchParam = useCallback(
		(key: string) => {
			const updatedParams = { ...searchParams };
			delete (updatedParams as any)[key];
			const urlSearchParams = new URLSearchParams();
			for (const key in updatedParams) urlSearchParams.set(key, (updatedParams as any)[key].toString());
			setSearchParams(updatedParams);
			router.push(path + '?' + urlSearchParams.toString());
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchParams]
	);

	return {
		searchParams,
		removeSearchParam,
		updateSearchParams,
		getInitialUrlSearchParams,
	};
};
