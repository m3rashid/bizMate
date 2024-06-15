import qs from 'query-string'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, RouteIds } from '@tanstack/react-router'

import Pagination from './pagination'
import { ButtonProps } from './button'
import apiClient from '../../api/client'
import DataListHeader from './dataListHeader'
import { routeTree } from '../../routeTree.gen'
import { TableExportProps } from './tableExport'
import Masonry, { ResponsiveMasonry, ResponsiveMasonryProps } from 'react-responsive-masonry'
import { ExplicitAndAllObject, PageSearchParams, PaginationResponse } from '../../types'

export type CardListProps<T> = {
	route: RouteIds<typeof routeTree>
	pageSize?: number
	tableExportprops?: TableExportProps
	paginateUrl: string
	queryKeys: string[]
	title?: string
	description?: string
	addButtonLink?: string
	addButtonProps?: ButtonProps
	rootClassName?: string
	onEdit?: (item: T) => void
	emptyState?: ReactNode
	defaultEmptyStateName?: string
	otherActions?: ReactNode
	cardRenderer: (item: T) => ReactNode
	masonryProps?: { className?: string; columnsCountBreakPoints?: ResponsiveMasonryProps['columnsCountBreakPoints'] }
}

type Row = ExplicitAndAllObject<'id'>

function CardList<T extends Row>(props: CardListProps<T>) {
	const navigate = useNavigate()
	const locationSearch = qs.parse(location.search)

	const { isPending, data, refetch } = useQuery<PaginationResponse<T>>({
		queryKey: [...props.queryKeys, props.pageSize || 15, locationSearch.page],
		queryFn: () =>
			apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${locationSearch.page}&limit=${props.pageSize || 15}`),
	})

	if (isPending || !data) return null // make a card skeleton loader
	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<DataListHeader
				{...{
					refetch,
					title: props.title,
					description: props.description,
					otherActions: props.otherActions,
					addButtonLink: props.addButtonLink,
					addButtonProps: props.addButtonProps,
					tableExportprops: props.tableExportprops,
					defaultEmptyStateName: props.defaultEmptyStateName,
				}}
			/>

			<ResponsiveMasonry
				columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}
				{...props.masonryProps}
				className={twMerge('col-span-1 md:col-span-2 lg:col-span-3', props.masonryProps?.className)}
			>
				<Masonry gutter="1rem" className="mb-4">
					{data.docs.map((item) => (
						<props.cardRenderer key={item.id} {...item} />
					))}
				</Masonry>
			</ResponsiveMasonry>

			<Pagination
				{...{
					page: data.page,
					count: data.count,
					limit: data.limit,
					totalDocs: data.totalDocs,
					hasNextPage: data.hasNextPage,
					hasPreviousPage: data.hasPreviousPage,
					onNextClick: () => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page + 1 }) }),
					onPreviousClick: () => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page !== 1 ? prev.page - 1 : prev }) }),
				}}
			/>
		</div>
	)
}

export default CardList
