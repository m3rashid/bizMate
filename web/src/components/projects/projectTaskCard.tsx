import { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { useNavigate } from '@tanstack/react-router'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'

import { ProjectTask } from '../../types'

export type ProjectTaskCardProps = {
	task: ProjectTask
}

function ProjectTaskCard(props: ProjectTaskCardProps) {
	const [isMouseOver, setIsMouseOver] = useState(false)
	const navigate = useNavigate({ from: '/apps/projects/$projectId' })
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: props.task.id,
		data: { type: 'Task', task: props.task },
	})

	const style = { transition, transform: CSS.Transform.toString(transform) }

	if (isDragging) {
		return (
			<div
				style={style}
				ref={setNodeRef}
				className="relative z-50 flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-rose-500  p-2.5 text-left opacity-30"
			/>
		)
	}

	return (
		<div
			style={style}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			onMouseEnter={() => setIsMouseOver(true)}
			onMouseLeave={() => setIsMouseOver(false)}
			onClick={() => navigate({ to: `/apps/projects/${props.task.projectId}/tasks/${props.task.id}` })}
			className="bg-mainBackgroundColor task relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-rose-500"
		>
			<p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{props.task.title}</p>

			{isMouseOver && (
				<div className="absolute right-4 top-1/2 -translate-y-1/2 rounded stroke-white p-2">
					<TrashIcon className="mb-4 h-5 w-5 cursor-pointer text-danger" />
				</div>
			)}
		</div>
	)
}

export default ProjectTaskCard
