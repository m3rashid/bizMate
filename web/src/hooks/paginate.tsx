import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import apiClient from '../api/client'
import { PaginationResponse } from '../types'
import { getUniqueObjectsByKey } from '../utils/helpers'

export type UsePaginateProps = {
	url: string
	limit?: number
	filterKey?: string
	queryKeys: string[]
}

export function usePaginate<T extends Record<string, any>>(props: UsePaginateProps) {
	const res = useInfiniteQuery<PaginationResponse<T>>({
		initialPageParam: 1,
		queryKey: props.queryKeys,
		queryFn: ({ pageParam }) => apiClient(`${props.url}${props.url.includes('?') ? '&' : '?'}page=${pageParam}&limit=${props.limit || 20}`),
		getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
	})

	const docs = useMemo(() => {
		const pages = (res.data?.pages || []).reduce<T[]>((acc, curr) => [...acc, ...curr.docs], [])
		return getUniqueObjectsByKey<T>(pages, props.filterKey || 'id')
	}, [props.url, res.data])

	return {
		docs,
		...res,
	}
}
