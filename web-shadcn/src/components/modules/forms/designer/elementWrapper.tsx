import { FormElementInstance } from '@/components/modules/forms/builder/constants'
import { useFormDesigner } from '@/hooks/formDesigner'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export type ElementWrapperProps = PropsWithChildren & {
	item: FormElementInstance
}
function ElementWrapper(props: ElementWrapperProps) {
	const { removeNode, setFormDesigner, selectedNode } = useFormDesigner()
	const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id: props.item.id })

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={twMerge(
				'relative my-2 rounded-lg border-2 border-gray-200 p-4',
				selectedNode?.id === props.item.id ? 'ring-linkActive ring-2' : 'bg-gray-200',
				isDragging ? 'cursor-grab' : '',
			)}
			onClick={() => setFormDesigner((prev) => ({ ...prev, selectedNode: props.item }))}
			style={{ transition, transform: CSS.Transform.toString(transform), viewTransitionName: `form-wrapper-${props.item.id}` }}
		>
			{props.children}
			<div
				className="border-borderColor hover:bg-danger absolute -right-3 -top-3 z-50 rounded-full border-[1px] bg-white p-1 hover:border-0 hover:text-white"
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					removeNode(props.item.id)
				}}
			>
				{/* <Tooltip show="right" label="Double Click to remove">
					<XMarkIcon className="-mr-0.5 h-6 w-6" />
				</Tooltip> */}
			</div>
		</div>
	)
}

export default ElementWrapper
