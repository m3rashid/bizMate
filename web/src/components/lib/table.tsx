import SkeletonTable from '../skeletons/table'
import Button, { ButtonProps } from './button'
import DataListHeader from './dataListHeader'
import { NotFound } from './notFound'
import Pagination from './pagination'
import { TableExportProps } from './tableExport'
import apiClient from '@api/client'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { DbRow, PageRoute, PageSearchParams, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import qs from 'query-string'
import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

export type TableColumn<T> = {
	title: string
	dataKey: keyof T
	className?: string
	tableTdClassName?: string
	render?: FC<{ row: T; rowIndex: number }>
}

export type TableProps<T> = {
	pageSize?: number
	tableExportprops?: TableExportProps
	paginateUrl: string
	queryKeys: string[]
	columns: Array<TableColumn<T>>
	workspaceId: string
	title?: string
	description?: string
	addButtonLink?: PageRoute
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

function Table<T extends DbRow>(props: TableProps<T>) {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const locationSearch = qs.parse(location.search)

	const { isPending, data, refetch, isFetching } = useQuery<PaginationResponse<T>>({
		queryKey: [...props.queryKeys, props.pageSize || 15, locationSearch.page, props.workspaceId],
		queryFn: () =>
			apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${locationSearch.page}&limit=${props.pageSize || 15}`),
	})

	if (isPending || isFetching) return <SkeletonTable contentLength={5} />
	if (!data) return <NotFound />

	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<DataListHeader
				{...{
					refetch,
					isFetching,
					title: props.title,
					workspaceId: props.workspaceId,
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
								<h3 className="text-lg font-semibold text-gray-800">{`${t('No')} ${props.defaultEmptyStateName} ${t('found')}`}</h3>
								<p className="text-sm text-gray-500">{`${t('Get started by creating a new')} ${props.defaultEmptyStateName}`}</p>
							</div>
							{props.addButtonLink ? (
								<Button
									LeftIcon={<PlusIcon className="h-5 w-5" />}
									onClick={() => navigate({ to: props.addButtonLink, params: { workspaceId: props.workspaceId } })}
									label={`${t('Create')} ${props.title || props.defaultEmptyStateName}`}
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
											className={twMerge('border-t border-borderColor', props.tableRowClassName ? props.tableRowClassName(row, rowIndex) : '')}
										>
											{props.columns.map((column, columnIndex) => (
												<td
													key={row[column.dataKey] + String(columnIndex)}
													className={twMerge('whitespace-nowrap px-3 py-1 text-left text-sm', column.tableTdClassName)}
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
