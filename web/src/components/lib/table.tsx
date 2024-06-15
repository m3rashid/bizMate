import qs from 'query-string'
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { useNavigate, RouteIds } from '@tanstack/react-router'

import Pagination from './pagination'
import apiClient from '../../api/client'
import DataListHeader from './dataListHeader'
import Button, { ButtonProps } from './button'
import SkeletonTable from '../skeletons/table'
import { routeTree } from '../../routeTree.gen'
import { TableExportProps } from './tableExport'
import { ExplicitAndAllObject, PageSearchParams, PaginationResponse } from '../../types'

export type TableColumn<T> = {
	title: string
	dataKey: keyof T
	className?: string
	tableTdClassName?: string
	render?: FC<{ row: T; rowIndex: number }>
}

export type TableProps<T> = {
	route: RouteIds<typeof routeTree>
	pageSize?: number
	tableExportprops?: TableExportProps
	paginateUrl: string
	queryKeys: string[]
	columns: Array<TableColumn<T>>
	title?: string
	description?: string
	addButtonLink?: string
	addButtonProps?: ButtonProps
	rootClassName?: string
	tableRowClassName?: (data: T, rowIndex: number) => string
	tableRootClassName?: string
	tableHeadingRowClassName?: string
	tableHeadingClassName?: (columnIndex: number) => string
	onEdit?: (item: T) => void
	emptyState?: ReactNode
	defaultEmptyStateName?: string
	otherActions?: ReactNode
}

type Row = ExplicitAndAllObject<'id'>

function Table<T extends Row>(props: TableProps<T>) {
	const navigate = useNavigate()
	const locationSearch = qs.parse(location.search)

	const { isPending, data, refetch } = useQuery<PaginationResponse<T>>({
		queryKey: [...props.queryKeys, props.pageSize || 15, locationSearch.page],
		queryFn: () =>
			apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${locationSearch.page}&limit=${props.pageSize || 15}`),
	})

	if (isPending || !data) return <SkeletonTable contentLength={5} />
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

			<div className={twMerge('flow-root min-h-72 overflow-x-auto overflow-y-hidden', props.tableRootClassName)}>
				{data.docs.length === 0 ? (
					props.defaultEmptyStateName ? (
						<div className="flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
							<div className="text-center">
								<h3 className="text-lg font-semibold text-gray-800">{`No ${props.defaultEmptyStateName} found`}</h3>
								<p className="text-sm text-gray-500">{`Get started by creating a new ${props.defaultEmptyStateName}`}</p>
							</div>
							{props.addButtonLink ? (
								<Button
									LeftIcon={<PlusIcon className="h-5 w-5" />}
									onClick={() => navigate({ to: props.addButtonLink })}
									label={`Create ${props.title || props.defaultEmptyStateName}`}
									{...props.addButtonProps}
								/>
							) : null}
						</div>
					) : props.emptyState ? (
						props.emptyState
					) : (
						<div className="" />
					)
				) : (
					<div className="-my-2">
						<div className="inline-block min-w-full py-2 align-middle">
							<table className="w-full">
								<thead>
									<tr className={twMerge('select-none bg-pageBg', props.tableHeadingRowClassName)}>
										{props.columns.map((column, columnIndex) => (
											<th
												scope="col"
												key={column.title + columnIndex}
												className={twMerge(
													' p-3 text-left text-sm font-semibold',
													props.tableHeadingClassName ? props.tableHeadingClassName(columnIndex) : '',
												)}
											>
												{column.title}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{(data.docs || []).map((row, rowIndex) => (
										<tr
											key={row.id}
											className={twMerge('border-t-2 border-borderColor', props.tableRowClassName ? props.tableRowClassName(row, rowIndex) : '')}
										>
											{props.columns.map((column, columnIndex) => (
												<td
													key={row[column.dataKey] + String(columnIndex)}
													className={twMerge('whitespace-nowrap px-3 py-3.5 text-left text-sm', column.tableTdClassName)}
												>
													{column.render ? <column.render {...{ row, rowIndex }} /> : (String(row[column.dataKey]) satisfies ReactNode)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>

			<Pagination
				{...{
					count: data.count,
					hasNextPage: data.hasNextPage,
					hasPreviousPage: data.hasPreviousPage,
					limit: data.limit,
					page: data.page,
					totalDocs: data.totalDocs,
					onNextClick: () => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page + 1 }) }),
					onPreviousClick: () => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page !== 1 ? prev.page - 1 : prev }) }),
				}}
			/>
		</div>
	)
}

export default Table
