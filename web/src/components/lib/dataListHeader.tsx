import Button, { ButtonProps } from '@components/lib/button'
import TableExport, { TableExportProps } from '@components/lib/tableExport'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { PageRoute } from '@mytypes'
import { useNavigate } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type DataListHeaderProps = {
	title?: string
	isFetching: boolean
	refetch: () => void
	workspaceId: string
	description?: string
	hideRefresh?: boolean
	addButtonLink?: PageRoute
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
				{!props.hideRefresh ? (
					<Button
						size="small"
						variant="simple"
						onClick={() => props.refetch()}
						LeftIcon={<ArrowPathIcon className={twMerge('h-[18px] w-[18px]', props.isFetching ? 'animate-spin' : '')} />}
					/>
				) : null}
				{props.otherActions}
				{props.addButtonLink || Object.keys(props.addButtonProps || {}).length > 0 ? (
					<Button
						size="small"
						LeftIcon={<PlusIcon className="h-5 w-5" />}
						onClick={() => navigate({ to: props.addButtonLink, params: { workspaceId: props.workspaceId } })}
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
