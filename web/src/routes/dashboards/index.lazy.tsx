import apiClient from '../../api/client'
import AddEditDashboard from '../../components/dashboardDesigner/addEditDashboard'
import Button from '../../components/lib/button'
import CardList from '../../components/lib/cardList'
import Chip from '../../components/lib/chip'
import Tooltip from '../../components/lib/tooltip'
import PageContainer from '../../components/pageContainer'
import { usePopups } from '../../hooks/popups'
import { Dashboard } from '../../types'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { useMutation } from '@tanstack/react-query'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const Route = createLazyFileRoute('/dashboards/')({
	component: Dashboards,
})

function DashboardCard(props: Dashboard & { onEdit: () => void }) {
	const { addActionPopup, removeActionPopup, addMessagePopup } = usePopups()

	const { mutate: deleteDashboard } = useMutation({
		mutationKey: ['deleteDashboard', props.id],
		mutationFn: () => apiClient(`dashboards/delete/${props.id}`, { method: 'POST' }),
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
		<div className="h-min select-none rounded-lg border-2 border-white p-2.5 shadow-lg hover:border-primary">
			<div className="flex justify-between gap-2">
				<div>
					<Link
						to="/dashboards/$dashboardId"
						params={{ dashboardId: props.id.toString() }}
						className={twMerge('font-semibold underline', props.active ? 'text-success' : 'text-danger')}
					>
						{props.title}
					</Link>

					<div className="text-xs text-disabled">Created: {dayjs(props.createdAt).format('DD MMM, YYYY - HH:mm A')}</div>
					<div className="mt-2 text-sm">{props.description}</div>
				</div>

				<div className="">
					<Tooltip label="Edit Overall Dashboard" show="right">
						<PencilSquareIcon onClick={props.onEdit} className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight" />
					</Tooltip>
					<Tooltip label="Delete Dashboard" show="right">
						<TrashIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight" onClick={handleDeleteDashboard} />
					</Tooltip>
				</div>
			</div>

			<div className="mt-3 flex w-full flex-wrap gap-2">
				<Link to="/dashboards/$dashboardId/designer" params={{ dashboardId: props.id.toString() }}>
					<Chip>Go to Dashboard Designer</Chip>
				</Link>
			</div>
		</div>
	)
}

function Dashboards() {
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
		<PageContainer>
			<AddEditDashboard {...{ open, setOpen: onClose, ...(!!editRow ? { dashboard: editRow, refetch: () => {} } : { dashboard: undefined }) }} />

			<CardList<Dashboard>
				title="Dashboards"
				paginateUrl="/dashboards/all"
				queryKeys={['getDashboards']}
				defaultEmptyStateName="dashboards"
				otherActions={
					<Button onClick={() => setOpen(true)} size="small" LeftIcon={<PlusIcon className="h-4 w-4" />}>
						Add Dashboard
					</Button>
				}
				description="Create and manage all custom dashboards"
				tableExportprops={{ tableName: 'dashboard_table', mutationKeys: [] }}
				cardRenderer={(dashboard) => <DashboardCard {...dashboard} onEdit={() => onEdit(dashboard)} />}
			/>
		</PageContainer>
	)
}
