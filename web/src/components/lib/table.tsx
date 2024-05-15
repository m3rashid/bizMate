import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { ExplicitAndAllObject } from '../../types'

export type TableColumn<T> = {
	title: string
	dataKey: keyof T
	className?: string
	tableTdClassName?: string
	render?: FC<{ row: T; rowIndex: number }>
}

export type TableProps<T> = {
	data: Array<T>
	columns: Array<TableColumn<T>>
	title?: string
	description?: string
	addButton?: ReactNode
	rootClassName?: string
	tableRowClassName?: (rowIndex: number) => string
	tableRootClassName?: string
	tableHeadingRowClassName?: string
	tableHeadingClassName?: (columnIndex: number) => string
	onEdit?: (item: T) => void
	emptyState?: ReactNode
}

type Row = ExplicitAndAllObject<'id'>
function Table<T extends Row>(props: TableProps<T>) {
	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<div className={twMerge('sm:flex sm:items-center', props.title || props.description || props.addButton ? 'mb-8' : '')}>
				{props.title || props.description ? (
					<div className="sm:flex-auto">
						{props.title ? <h1 className="text-2xl font-semibold leading-6 text-gray-900">{props.title}</h1> : null}
						{props.description ? <p className="mt-2 text-sm text-gray-700">{props.description}</p> : null}
					</div>
				) : null}

				{props.addButton ? <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">{props.addButton}</div> : null}
			</div>

			<div className={twMerge('flow-root min-h-72 overflow-x-auto overflow-y-hidden', props.tableRootClassName)}>
				{props.data.length === 0 ? (
					props.emptyState ? (
						props.emptyState
					) : (
						<div className=""></div>
					)
				) : (
					<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
									{(props.data || []).map((row, rowIndex) => (
										<tr
											key={row.id}
											className={twMerge(
												'transition-colors duration-200 ease-in-out hover:bg-pageBg hover:shadow-sm',
												props.tableRowClassName ? props.tableRowClassName(rowIndex) : '',
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
		</div>
	)
}

export default Table
