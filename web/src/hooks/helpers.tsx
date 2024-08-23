'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSearchParamsState(queryKey: string, inititalState: string) {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();

	function setState(newVal: string) {
		const current = new URLSearchParams(Array.from(params.entries()));
		current.set(queryKey, newVal);
		const search = current.toString();
		const query = search ? `?${search}` : '';
		router.push(`${pathname}${query}`);
	}

	return [params.get(queryKey) || inititalState, setState] as const;
}
