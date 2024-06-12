import { CSS } from '@dnd-kit/utilities'
import { twMerge } from 'tailwind-merge'
import { PropsWithChildren } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon'

import Tooltip from '../lib/tooltip'
import { FormElementInstance } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'

export type ElementWrapperProps = PropsWithChildren & {
	item: FormElementInstance
}
function ElementWrapper(props: ElementWrapperProps) {
	const { removeNode, setFormDesigner, selectedNode } = useFormDesigner()
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
			style={{ transition, transform: CSS.Transform.toString(transform), viewTransitionName: `form-wrapper-${props.item.id}` }}
			onClick={() => setFormDesigner((prev) => ({ ...prev, selectedNode: props.item }))}
		>
			{props.children}
			<div
				className="absolute right-0 top-0 z-50 rounded-full bg-white hover:bg-danger"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					removeNode(props.item.id)
				}}
			>
				<Tooltip show="right" label="Double Click to remove">
					<XMarkIcon className="-mr-0.5 h-8 w-8" />
				</Tooltip>
			</div>
		</div>
	)
}

export default ElementWrapper
