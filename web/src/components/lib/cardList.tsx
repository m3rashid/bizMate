import apiClient from '@api/client'
import { ButtonProps } from '@components/lib/button'
import DataListHeader from '@components/lib/dataListHeader'
import Pagination from '@components/lib/pagination'
import { TableExportProps } from '@components/lib/tableExport'
import SkeletonCardList from '@components/skeletons/cardList'
import { DbRow, PageRoute, PageSearchParams, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import qs from 'query-string'
import { ReactNode } from 'react'
import Masonry, { ResponsiveMasonry, ResponsiveMasonryProps } from 'react-responsive-masonry'
import { twMerge } from 'tailwind-merge'

export type CardListProps<T> = {
	pageSize?: number
	tableExportprops?: TableExportProps
	paginateUrl: string
	workspaceId: string
	queryKeys: string[]
	title?: string
	description?: string
	addButtonLink?: PageRoute
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

	const {
		refetch,
		isPending,
		isFetching,
		data: result,
	} = useQuery<{ data: PaginationResponse<T>; message: string; success: boolean }>({
		queryKey: [...props.queryKeys, props.pageSize || 15, locationSearch.page, props.workspaceId],
		queryFn: () =>
			apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${locationSearch.page}&limit=${props.pageSize || 15}`),
	})

	if (isPending || !result) return <SkeletonCardList />
	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<DataListHeader
				{...{
					refetch,
					isFetching,
					title: props.title,
					description: props.description,
					workspaceId: props.workspaceId,
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
					{result.data.docs.map((item) => (
						<props.cardRenderer key={item.id} {...item} />
					))}
				</Masonry>
			</ResponsiveMasonry>

			<Pagination
				{...{
					page: result.data.page,
					count: result.data.count,
					limit: result.data.limit,
					totalDocs: result.data.totalDocs,
					hasNextPage: result.data.hasNextPage,
					hasPreviousPage: result.data.hasPreviousPage,
					onNextClick: () => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page + 1 }) }),
					onPreviousClick: () => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page !== 1 ? prev.page - 1 : prev }) }),
				}}
			/>
		</div>
	)
}

export default CardList
