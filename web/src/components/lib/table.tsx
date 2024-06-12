import { twMerge } from 'tailwind-merge'
import { FC, ReactNode, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'

import { PageLoader } from './loader'
import apiClient from '../../api/client'
import Button, { ButtonProps } from './button'
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
}

type Row = ExplicitAndAllObject<'id'>
function Table<T extends Row>(props: TableProps<T>) {
	const [page, setPage] = useState(1)

	const navigate = useNavigate()
	const { isPending, data } = useQuery<PaginationResponse<T>>({
		queryKey: [...props.queryKeys, page, props.pageSize || 15],
		queryFn: () => apiClient(`${props.paginateUrl}${props.paginateUrl.includes('?') ? '&' : '?'}page=${page}&limit=${props.pageSize || 15}`),
	})

	if (isPending || !data) return <PageLoader />
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
					{props.addButtonLink ? (
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
									<tr className={twMerge('select-none rounded-lg bg-primary text-white', props.tableHeadingRowClassName)}>
										{props.columns.map((column, columnIndex) => (
											<th
												scope="col"
												key={column.title + columnIndex}
												className={twMerge(
													' p-3 text-left text-sm font-semibold',
													columnIndex === 0 ? 'rounded-l-lg' : '',
													columnIndex === props.columns.length - 1 ? 'rounded-r-lg' : '',
													props.tableHeadingClassName ? props.tableHeadingClassName(columnIndex) : '',
												)}
											>
												{column.title}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{(data.docs || []).map((row, rowIndex) => (
										<tr
											key={row.id}
											className={twMerge(
												'transition-colors duration-200 ease-in-out hover:bg-pageBg hover:shadow-sm',
												props.tableRowClassName ? props.tableRowClassName(row, rowIndex) : '',
											)}
										>
											{props.columns.map((column, columnIndex) => (
												<td
													key={row[column.dataKey] + String(columnIndex)}
													className={twMerge(
														'whitespace-nowrap px-3 py-3.5 text-left text-sm',
														columnIndex === 0 ? 'rounded-l-lg' : '',
														columnIndex === props.columns.length - 1 ? 'rounded-r-lg' : '',
														column.tableTdClassName,
													)}
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
						Showing {Math.min(data.page * data.limit, data.count)} of {data.totalDocs} results
					</p>
				</div>
				<div className="flex flex-1 justify-between gap-4 sm:justify-end">
					<Button
						size="small"
						disabled={!data.hasPreviousPage}
						variant={data.hasPreviousPage ? 'simple' : 'disabled'}
						onClick={() => setPage((prev) => (prev !== 1 ? prev - 1 : prev))}
					>
						Previous
					</Button>
					<Button
						size="small"
						disabled={!data.hasNextPage}
						onClick={() => setPage((prev) => prev + 1)}
						variant={data.hasNextPage ? 'simple' : 'disabled'}
					>
						Next
					</Button>
				</div>
			</nav>
		</div>
	)
}

export default Table
