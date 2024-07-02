import Tooltip from '@components/lib/tooltip'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { DashboardWidget, useDashboardDesigner } from '@hooks/dashboardDesigner'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export type WidgetWrapperProps = PropsWithChildren & {
	item: DashboardWidget
}

function WidgetWrapper(props: WidgetWrapperProps) {
	const { selectedNode, removeWidget } = useDashboardDesigner()
	const { attributes, setNodeRef, listeners, transform, transition } = useSortable({ id: props.item.id })

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={twMerge(
				'relative my-2 rounded-lg border-2 border-gray-200 p-4',
				selectedNode?.id === props.item.id ? 'ring-2 ring-linkActive' : 'bg-gray-200',
			)}
			style={{ transition, transform: CSS.Transform.toString(transform) }}
		>
			{props.children}
			<div
				className="absolute right-0 top-0 z-50 rounded-full bg-white hover:bg-pageBg"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					removeWidget(props.item.id)
				}}
			>
				<Tooltip label="Double Click to remove">
					<XMarkIcon className="-mr-0.5 h-8 w-8" />
				</Tooltip>
			</div>
		</div>
	)
}

export default WidgetWrapper
