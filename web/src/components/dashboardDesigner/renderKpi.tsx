import apiClient from '../../api/client'
import { usePopups } from '../../hooks/popups'
import Button from '../lib/button'
import Tooltip from '../lib/tooltip'
import { InformationCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

type RenderKpiProps = {
	kpiId: number
	title: string
	description: string
	data: number
} & ({ viewType: 'preview' } | { viewType: 'edit' })

function RenderStaticKpi(props: RenderKpiProps) {
	return (
		<div className="h-min w-64 select-none rounded-lg border-2 border-white bg-white p-2.5 shadow-lg hover:border-primary">
			<div className="mb-1 flex items-center gap-2 text-disabled ">
				<h3 className="font-semibold">{props.title}</h3>
				{props.description ? (
					<Tooltip label={props.description} position="left">
						<InformationCircleIcon className="h-4 w-4" />
					</Tooltip>
				) : null}
			</div>
			<div className="my-4 mt-6 h-10 text-center text-5xl font-bold">{props.data}</div>
		</div>
	)
}

function RenderEditableKpi(props: RenderKpiProps) {
	const { addActionPopup, removeActionPopup } = usePopups()
	const [showActions, setShowActions] = useState(false)

	const { mutate: deleteKpi } = useMutation({
		mutationKey: ['deleteKpi', props.kpiId],
		mutationFn: () => apiClient(`/dashboards/kpis/delete/${props.kpiId}`, { method: 'POST' }),
	})

	function onClickDelete() {
		const popupId = 'delete-kpi-popup'
		addActionPopup({
			id: popupId,
			type: 'warning',
			children: (
				<>
					<h3 className="text-sm text-disabled">This is a potentially destructive action! Once deleted, the kpi cannot be retrieved again</h3>
					<div className="mt-2 flex items-center justify-between">
						<Button size="small" variant="simple" onClick={() => removeActionPopup('sureToDeleteForm')} className="py-1">
							Cancel
						</Button>
						<Button
							size="small"
							variant="danger"
							onClick={() => {
								deleteKpi()
								removeActionPopup(popupId)
							}}
							className="py-1"
						>
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
			className="relative h-min w-64 select-none rounded-lg border-2 border-white bg-white p-2.5 shadow-lg hover:border-primary"
		>
			{showActions ? (
				<div className="absolute bottom-1 right-1 flex items-center gap-1">
					<Tooltip label="Edit KPI" position="left">
						<PencilSquareIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight" />
					</Tooltip>
					<Tooltip label="Delete KPI" position="left">
						<TrashIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight" onClick={onClickDelete} />
					</Tooltip>
				</div>
			) : null}

			<div className="mb-1 flex items-center gap-2 text-disabled ">
				<h3 className="font-semibold">{props.title}</h3>
				{props.description ? (
					<Tooltip label={props.description} position="left">
						<InformationCircleIcon className="h-4 w-4" />
					</Tooltip>
				) : null}
			</div>
			<div className="my-4 mt-6 h-10 text-center text-5xl font-bold">{props.data}</div>
		</div>
	)
}

function RenderKpi(props: RenderKpiProps) {
	if (props.viewType === 'edit') return <RenderEditableKpi {...props} />
	return <RenderStaticKpi {...props} />
}

export default RenderKpi
