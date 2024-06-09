import { useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'

import { ProjectTask } from '../../types'

export type ProjectTaskCardProps = {
	task: ProjectTask
}

function ProjectTaskCard(props: ProjectTaskCardProps) {
	const [mouseIsOver, setMouseIsOver] = useState(false)
	const [editMode, setEditMode] = useState(true)

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: props.task.id,
		data: {
			type: 'Task',
			task: props.task,
		},
		disabled: editMode,
	})

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	}

	const toggleEditMode = () => {
		setEditMode((prev) => !prev)
		setMouseIsOver(false)
	}

	if (isDragging) {
		return (
			<div
				style={style}
				ref={setNodeRef}
				className="bg-mainBackgroundColor relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-rose-500 p-2.5  text-left opacity-30"
			/>
		)
	}

	if (editMode) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				className="bg-mainBackgroundColor relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-rose-500"
			>
				<textarea
					value={props.task.description}
					autoFocus
					placeholder="Task content here"
					className="h-[90%] w-full resize-none rounded border-none bg-transparent text-white focus:outline-none"
					onBlur={toggleEditMode}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && e.shiftKey) {
							toggleEditMode()
						}
					}}
					// onChange={(e) => updateTask(task.id, e.target.value)}
				/>
			</div>
		)
	}

	return (
		<div
			style={style}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			onClick={toggleEditMode}
			onMouseEnter={() => setMouseIsOver(true)}
			onMouseLeave={() => setMouseIsOver(false)}
			className="bg-mainBackgroundColor task relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-rose-500"
		>
			<p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{props.task.title}</p>

			{mouseIsOver && (
				<button
					// onClick={() => {
					// 	deleteTask(task.id)
					// }}
					className="bg-columnBackgroundColor absolute right-4 top-1/2 -translate-y-1/2 rounded stroke-white p-2 opacity-60 hover:opacity-100"
				>
					<TrashIcon className="" />
				</button>
			)}
		</div>
	)
}

export default ProjectTaskCard
