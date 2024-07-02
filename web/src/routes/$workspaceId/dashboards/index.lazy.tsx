import apiClient from '@api/client'
import AddEditDashboard from '@components/dashboardDesigner/addEditDashboard'
import Button from '@components/lib/button'
import CardList from '@components/lib/cardList'
import Chip from '@components/lib/chip'
import Tooltip from '@components/lib/tooltip'
import PageContainer from '@components/pageContainer'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { usePopups } from '@hooks/popups'
import { Dashboard } from '@mytypes'
import { useMutation } from '@tanstack/react-query'
import { Link, createLazyFileRoute, useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const Route = createLazyFileRoute('/$workspaceId/dashboards/')({
	component: Dashboards,
})

function DashboardCard(props: Dashboard & { onEdit: () => void; workspaceId: string }) {
	const [showActions, setShowActions] = useState(false)
	const { addActionPopup, removeActionPopup, addMessagePopup } = usePopups()

	const { mutate: deleteDashboard } = useMutation({
		mutationKey: ['deleteDashboard', props.id],
		mutationFn: () => apiClient(`/${props.workspaceId}/dashboards/delete/${props.id}`, { method: 'POST' }),
		onError: () => addMessagePopup({ id: 'errorDeleteDashboard', message: 'Error in deleting dashboard', type: 'error' }),
		onSuccess: () => addMessagePopup({ id: 'dashboardDeleteSuccess', message: 'Dashboard deleted Successfully', type: 'success' }),
	})

	function onDeleteConfirm() {
		deleteDashboard()
		removeActionPopup('sureToDeleteDashboard')
	}

	function handleDeleteDashboard() {
		addActionPopup({
			type: 'warning',
			id: 'sureToDeleteDashboard',
			title: 'Are you sure ?',
			children: (
				<>
					<h3 className="text-sm text-disabled">This is a potentially destructive action! Once deleted, the dashboard cannot be retrieved again</h3>
					<div className="mt-2 flex items-center justify-between">
						<Button size="small" variant="simple" onClick={() => removeActionPopup('sureToDeleteDashboard')} className="py-1">
							Cancel
						</Button>
						<Button size="small" variant="danger" onClick={onDeleteConfirm} className="py-1">
							Delete
						</Button>
					</div>
				</>
			),
		})
	}

	return (
		<div
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
			className="relative h-min select-none rounded-lg border-2 border-white p-2.5 shadow-lg hover:border-primary "
		>
			<div>
				<Link
					to="/$workspaceId/dashboards/$dashboardId"
					params={{ dashboardId: props.id, workspaceId: props.workspaceId }}
					className={twMerge('font-semibold underline', props.active ? 'text-success' : 'text-danger')}
				>
					{props.title}
				</Link>

				<div className="mb-8 text-xs text-disabled">Created: {dayjs(props.createdAt).format('DD MMM, YYYY - HH:mm A')}</div>
				{props.description ? <div className="-mt-4 text-sm">{props.description}</div> : null}
			</div>

			{showActions ? (
				<div className="absolute right-1 top-1">
					<Tooltip label="Edit Overall Dashboard" position="left">
						<PencilSquareIcon onClick={props.onEdit} className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight" />
					</Tooltip>
					<Tooltip label="Delete Dashboard" position="left">
						<TrashIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight" onClick={handleDeleteDashboard} />
					</Tooltip>
				</div>
			) : null}

			<div className="mt-4 w-full">
				<Link to="/$workspaceId/dashboards/$dashboardId/designer" params={{ dashboardId: props.id, workspaceId: props.workspaceId }}>
					<Chip className="w-full">Go to Dashboard Designer</Chip>
				</Link>
			</div>
		</div>
	)
}

function Dashboards() {
	const { workspaceId } = useParams({ from: '/$workspaceId/dashboards/' })
	const [open, setOpen] = useState(false)
	const [editRow, setEditRow] = useState<Dashboard | undefined>(undefined)

	function onEdit(row: Dashboard) {
		setEditRow(row)
		setOpen(true)
	}

	function onClose() {
		setEditRow(undefined)
		setOpen(false)
	}

	return (
		<PageContainer workspaceId={workspaceId}>
			<AddEditDashboard {...{ open, setOpen: onClose, ...(!!editRow ? { dashboard: editRow, refetch: () => {} } : { dashboard: undefined }) }} />

			<CardList<Dashboard>
				title="Dashboards"
				paginateUrl={`/${workspaceId}/dashboards/all`}
				queryKeys={['getDashboards']}
				workspaceId={workspaceId}
				defaultEmptyStateName="dashboards"
				otherActions={
					<Button onClick={() => setOpen(true)} size="small" LeftIcon={<PlusIcon className="h-4 w-4" />}>
						Add Dashboard
					</Button>
				}
				description="Create and manage all custom dashboards"
				tableExportprops={{ tableName: 'dashboard_table', mutationKeys: [], workspaceId }}
				cardRenderer={(dashboard) => <DashboardCard workspaceId={workspaceId} {...dashboard} onEdit={() => onEdit(dashboard)} />}
			/>
		</PageContainer>
	)
}
