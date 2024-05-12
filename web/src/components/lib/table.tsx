import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { ExplicitAndAllObject } from '../../types'

export type Column<T> = {
	title: string
	dataKey: keyof T
	className?: string
	tableTdClassName?: string
	render?: FC<{ row: T; rowIndex: number }>
}

export type TableProps<T> = {
	data: Array<T>
	columns: Array<Column<T>>
	title?: string
	description?: string
	addButton?: ReactNode
	rootClassName?: string
	tableRowClassName?: string
	tableRootClassName?: string
	tableHeadingClassName?: string
	onEdit?: (item: T) => void
	emptyState?: ReactNode
}

type Row = ExplicitAndAllObject<Record<string, any>, { id: string | number }>
function Table<T extends Row>(props: TableProps<T>) {
	return (
		<div className={twMerge('h-full w-full', props.rootClassName)}>
			<div
				className={twMerge(
					'sm:flex sm:items-center',
					props.title || props.description || props.addButton ? 'mb-8' : '',
				)}
			>
				{props.title || props.description ? (
					<div className="sm:flex-auto">
						{props.title ? (
							<h1 className="text-base font-semibold leading-6 text-gray-900">{props.title}</h1>
						) : null}
						{props.description ? (
							<p className="mt-2 text-sm text-gray-700">{props.description}</p>
						) : null}
					</div>
				) : null}

				{props.addButton ? (
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">{props.addButton}</div>
				) : null}
			</div>

			<div
				className={twMerge(
					'flow-root min-h-72 max-w-screen-sm overflow-x-auto overflow-y-hidden sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl',
					props.tableRootClassName,
				)}
			>
				{props.data.length === 0 ? (
					props.emptyState ? (
						props.emptyState
					) : (
						<div className=""></div>
					)
				) : (
					<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							<table className="min-w-full divide-y divide-gray-300">
								<thead>
									<tr>
										{props.columns.map((column) => (
											<th
												scope="col"
												key={column.title}
												className={twMerge(
													'px-3 py-3.5 text-left text-sm font-semibold text-gray-900',
													props.tableHeadingClassName,
												)}
											>
												{column.title}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{(props.data || []).map((row, rowIndex) => (
										<tr key={row.id} className={twMerge('', props.tableRowClassName)}>
											{props.columns.map((column) => (
												<td
													key={row[column.dataKey]}
													className={twMerge(
														'whitespace-nowrap px-3 py-3.5 text-left text-sm',
														column.tableTdClassName,
													)}
												>
													{column.render ? (
														<column.render {...{ row, rowIndex }} />
													) : (
														row[column.dataKey]
													)}
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
