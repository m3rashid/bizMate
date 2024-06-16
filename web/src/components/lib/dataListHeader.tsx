import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useNavigate } from '@tanstack/react-router'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'

import Button, { ButtonProps } from './button'
import TableExport, { TableExportProps } from './tableExport'

type DataListHeaderProps = {
	title?: string
	isFetching: boolean
	refetch: () => void
	description?: string
	addButtonLink?: string
	otherActions?: ReactNode
	addButtonProps?: ButtonProps
	defaultEmptyStateName?: string
	tableExportprops?: TableExportProps
}

function DataListHeader(props: DataListHeaderProps) {
	const navigate = useNavigate()

	return (
		<div className={twMerge('sm:flex sm:items-center', props.title || props.description || props.addButtonLink ? 'mb-8' : '')}>
			{props.title || props.description ? (
				<div className="sm:flex-auto">
					{props.title ? <h1 className="text-2xl font-semibold leading-6 text-gray-900">{props.title}</h1> : null}
					{props.description ? <p className="mt-2 text-sm text-gray-700">{props.description}</p> : null}
				</div>
			) : null}

			<div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:ml-8 sm:mt-0">
				<Button
					size="small"
					variant="simple"
					LeftIcon={<ArrowPathIcon className={twMerge('h-4 w-4', props.isFetching ? 'animate-spin' : '')} />}
					onClick={() => props.refetch()}
				/>
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
	)
}

export default DataListHeader
