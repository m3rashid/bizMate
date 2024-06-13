import qs from 'query-string'
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { useNavigate, RouteIds } from '@tanstack/react-router'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import Chip from './chip'
import apiClient from '../../api/client'
import Button, { ButtonProps } from './button'
import SkeletonTable from '../skeletons/table'
import { routeTree } from '../../routeTree.gen'
import TableExport, { TableExportProps } from './tableExport'
import { ExplicitAndAllObject, PaginationResponse } from '../../types'

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
export type PageSearchParams = { page: number }

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
			<div className={twMerge('sm:flex sm:items-center', props.title || props.description || props.addButtonLink ? 'mb-8' : '')}>
				{props.title || props.description ? (
					<div className="sm:flex-auto">
						{props.title ? <h1 className="text-2xl font-semibold leading-6 text-gray-900">{props.title}</h1> : null}
						{props.description ? <p className="mt-2 text-sm text-gray-700">{props.description}</p> : null}
					</div>
				) : null}

				<div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:ml-8 sm:mt-0">
					<Button size="small" variant="simple" LeftIcon={<ArrowPathIcon className="h-4 w-4" />} onClick={() => refetch()} />
					{props.otherActions}
					{props.addButtonLink || Object.keys(props.addButtonProps || {}).length > 0 ? (
						<Button
							size="small"
							LeftIcon={<PlusIcon className="h-5 w-5" />}
							onClick={() => navigate({ to: props.addButtonLink })}
							label={`Create ${props.title || props.defaultEmptyStateName}`}
							{...props.addButtonProps}
						/>
					) : null}
					{props.tableExportprops ? <TableExport {...props.tableExportprops} /> : null}
				</div>
			</div>

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

			<nav className="flex items-center justify-between border-b-2 border-pageBg bg-white p-2" aria-label="Pagination">
				<div className="hidden sm:block">
					<p className="text-sm text-gray-700">
						Showing <span className="font-semibold">{Math.min(data.page * data.limit, data.count)}</span> of&nbsp;
						<span className="font-semibold">{data.totalDocs}</span> results
					</p>
				</div>
				<div className="flex flex-1 justify-between gap-4 sm:justify-end">
					<Button
						size="small"
						variant="simple"
						disabled={!data.hasPreviousPage}
						onClick={() => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page !== 1 ? prev.page - 1 : prev }) })}
					>
						Previous
					</Button>

					<Chip variant="simple" className="h-full">
						{data.page}
					</Chip>

					<Button
						size="small"
						variant="simple"
						disabled={!data.hasNextPage}
						onClick={() => navigate({ search: (prev: PageSearchParams) => ({ page: prev.page + 1 }) })}
					>
						Next
					</Button>
				</div>
			</nav>
		</div>
	)
}

export default Table
