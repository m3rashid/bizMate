'use client';

import { Button, ButtonProps } from '@/components/lib/button';
import { TableExport, TableExportProps } from '@/components/lib/tableExport';
import { cn } from '@/utils/helpers';
import { DbRow } from '@/utils/types';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useTransitionRouter } from 'next-view-transitions';
import { FC, ReactNode } from 'react';

export type SimpleTableColumn<T> = {
	title: string;
	dataKey: keyof T;
	className?: string;
	tableTdClassName?: string;
	render?: FC<{ row: T; rowIndex: number }>;
};

export type SimpleTableProps<T> = {
	data: Array<T>;
	tableExportprops?: TableExportProps;
	columns: Array<SimpleTableColumn<T>>;
	title?: string;
	description?: string;
	addButtonLink?: string;
	addButtonProps?: ButtonProps;
	rootClassName?: string;
	tableRowClassName?: (rowIndex: number) => string;
	tableRootClassName?: string;
	tableHeadingRowClassName?: string;
	tableHeadingClassName?: (columnIndex: number) => string;
	onEdit?: (item: T) => void;
	emptyState?: ReactNode;
	otherActions?: ReactNode;
	defaultEmptyStateName?: string;
};

export function SimpleTable<T extends DbRow>(props: SimpleTableProps<T>) {
	const router = useTransitionRouter();

	return (
		<div className={cn('w-full', props.rootClassName)}>
			<div className={cn('sm:flex sm:items-center', props.title || props.description || props.addButtonLink ? 'mb-8' : '')}>
				{props.title || props.description ? (
					<div className='sm:flex-auto'>
						{props.title ? <h1 className='text-2xl font-semibold leading-6 text-gray-900'>{props.title}</h1> : null}
						{props.description ? <p className='mt-2 text-sm text-gray-700'>{props.description}</p> : null}
					</div>
				) : null}

				<div className='mt-4 flex flex-wrap items-center justify-center gap-2 sm:ml-8 sm:mt-0'>
					{props.otherActions}
					{props.addButtonLink ? (
						<Button
							label={`New ${props.title || props.defaultEmptyStateName}`}
							LeftIcon={<PlusIcon className='h-5 w-5' />}
							onClick={() => router.push(props.addButtonLink || '')}
							{...props.addButtonProps}
						/>
					) : null}
					{props.tableExportprops ? <TableExport {...props.tableExportprops} /> : null}
				</div>
			</div>

			<div className={cn('flow-root min-h-72 overflow-x-auto overflow-y-hidden', props.tableRootClassName)}>
				{props.data.length === 0 ? (
					props.defaultEmptyStateName ? (
						<div className='flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200'>
							<div className='text-center'>
								<h3 className='text-lg font-semibold text-gray-800'>{`No ${props.defaultEmptyStateName} found`}</h3>
								<p className='text-sm text-gray-500'>{`Get started by creating a new ${props.defaultEmptyStateName}`}</p>
							</div>
							{props.addButtonLink ? (
								<Button
									LeftIcon={<PlusIcon className='h-5 w-5' />}
									onClick={() => router.push(props.addButtonLink || '')}
									label={`New ${props.title || props.defaultEmptyStateName}`}
									{...props.addButtonProps}
								/>
							) : null}
						</div>
					) : props.emptyState ? (
						props.emptyState
					) : null
				) : (
					<div className='-my-2'>
						<div className='inline-block min-w-full py-2 align-middle'>
							<table className='w-full'>
								<thead>
									<tr className={cn('select-none bg-gray-100', props.tableHeadingRowClassName)}>
										{props.columns.map((column, columnIndex) => (
											<th
												scope='col'
												key={column.title + columnIndex}
												className={cn(
													'px-3 py-2.5 text-left text-sm font-semibold',
													props.tableHeadingClassName ? props.tableHeadingClassName(columnIndex) : ''
												)}
											>
												{column.title}
											</th>
										))}
									</tr>
								</thead>

								<tbody>
									{(props.data || []).map((row, rowIndex) => (
										<tr
											key={row.id + String(rowIndex)}
											className={cn('border-t border-borderColor', props.tableRowClassName ? props.tableRowClassName(rowIndex) : '')}
										>
											{props.columns.map((column, columnIndex) => (
												<td
													key={row[column.dataKey] + String(columnIndex)}
													className={cn('whitespace-nowrap px-3 py-2.5 text-left text-sm', column.tableTdClassName)}
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
	);
}
