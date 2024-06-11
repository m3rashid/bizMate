import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useNavigate } from '@tanstack/react-router'
import { PlusIcon } from '@heroicons/react/24/outline'

import Button, { ButtonProps } from './button'
import { ExplicitAndAllObject } from '../../types'
import TableExport, { TableExportProps } from './tableExport'

export type SimpleTableColumn<T> = {
	title: string
	dataKey: keyof T
	className?: string
	tableTdClassName?: string
	render?: FC<{ row: T; rowIndex: number }>
}

export type SimpleTableProps<T> = {
	data: Array<T>
	tableExportprops?: TableExportProps
	columns: Array<SimpleTableColumn<T>>
	title?: string
	description?: string
	addButtonLink?: string
	addButtonProps?: ButtonProps
	rootClassName?: string
	tableRowClassName?: (rowIndex: number) => string
	tableRootClassName?: string
	tableHeadingRowClassName?: string
	tableHeadingClassName?: (columnIndex: number) => string
	onEdit?: (item: T) => void
	emptyState?: ReactNode
	defaultEmptyStateName?: string
}

type Row = ExplicitAndAllObject<'id'>
function SimpleTable<T extends Row>(props: SimpleTableProps<T>) {
	const navigate = useNavigate()

	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<div className={twMerge('sm:flex sm:items-center', props.title || props.description || props.addButtonLink ? 'mb-8' : '')}>
				{props.title || props.description ? (
					<div className="sm:flex-auto">
						{props.title ? <h1 className="text-2xl font-semibold leading-6 text-gray-900">{props.title}</h1> : null}
						{props.description ? <p className="mt-2 text-sm text-gray-700">{props.description}</p> : null}
					</div>
				) : null}

				<div>
					{props.addButtonLink ? (
						<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
							<Button
								label={`New ${props.title || props.defaultEmptyStateName}`}
								LeftIcon={<PlusIcon className="h-5 w-5" />}
								onClick={() => navigate({ to: props.addButtonLink })}
								{...props.addButtonProps}
							/>
						</div>
					) : null}
					{props.tableExportprops ? <TableExport {...props.tableExportprops} /> : null}
				</div>
			</div>

			<div className={twMerge('flow-root min-h-72 overflow-x-auto overflow-y-hidden', props.tableRootClassName)}>
				{props.data.length === 0 ? (
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
									label={`New ${props.title || props.defaultEmptyStateName}`}
									{...props.addButtonProps}
								/>
							) : null}
						</div>
					) : props.emptyState ? (
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

export default SimpleTable
