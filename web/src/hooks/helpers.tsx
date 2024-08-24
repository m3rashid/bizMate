'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSearchParamsState(queryKey: string, inititalState: string) {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();

	function setState(_newVal: string | ((prevState: string) => string)) {
		const current = new URLSearchParams(Array.from(params.entries()));
		const newVal = typeof _newVal === 'function' ? _newVal(current.get(queryKey) || inititalState) : _newVal;
		current.set(queryKey, newVal);
		const search = current.toString();
		const query = search ? `?${search}` : '';
		router.push(`${pathname}${query}`);
	}

	return [params.get(queryKey) || inititalState, setState] as const;
}
