import qs from 'query-string'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import Masonry, { ResponsiveMasonry, ResponsiveMasonryProps } from 'react-responsive-masonry'

import Pagination from './pagination'
import { ButtonProps } from './button'
import apiClient from '../../api/client'
import DataListHeader from './dataListHeader'
import { TableExportProps } from './tableExport'
import SkeletonCardList from '../skeletons/cardList'
import { DbRow, PageSearchParams, PaginationResponse } from '../../types'

export type CardListProps<T> = {
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

function CardList<T extends DbRow>(props: CardListProps<T>) {
	const navigate = useNavigate()
	const locationSearch = qs.parse(location.search)

	const { isPending, data, refetch, isFetching } = useQuery<PaginationResponse<T>>({
		queryKey: [...props.queryKeys, props.pageSize || 15, locationSearch.page],
		queryFn: () =>
			apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${locationSearch.page}&limit=${props.pageSize || 15}`),
	})

	if (isPending || !data) return <SkeletonCardList />
	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<DataListHeader
				{...{
					refetch,
					isFetching,
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
				columnsCountBreakPoints={{ 350: 1, 700: 2, 1050: 3, 1400: 4, 1750: 5 }}
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
