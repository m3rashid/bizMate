import { useState } from 'react'
import { SortableContext } from '@dnd-kit/sortable'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import AddProjectTask from './addProjectTask'
import { usePaginate } from '../../hooks/paginate'
import { ProjectTask, taskStatuses } from '../../types'
import ColumnContainer from './projectKanbanColumnContainer'
import { useProjectKanban } from '../../hooks/projectKanban'

export type ProjectKanbanBoardProps = {
	projectId: string
}

function ProjectKanbanBoard(props: ProjectKanbanBoardProps) {
	const [modalOpen, setModalOpen] = useState(false)
	const { onDragEnd, onDragOver, onDragStart } = useProjectKanban()
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }))
	const { docs } = usePaginate<ProjectTask>({ url: `/projects/${props.projectId}/tasks/all`, queryKeys: ['getProjectTasks', props.projectId] })

	return (
		<div className="mt-4 max-w-max overflow-x-auto">
			<AddProjectTask modalOpen={modalOpen} setModalOpen={setModalOpen} projectId={props.projectId} />

			<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
				<div className="m-auto flex gap-4">
					<div className="flex gap-4">
						<SortableContext items={taskStatuses as any}>
							{taskStatuses.map((taskStatus) => (
								<ColumnContainer
									key={taskStatus}
									taskStatus={taskStatus}
									projectId={props.projectId}
									onAddTask={() => setModalOpen(true)}
									tasks={(docs || []).filter((t) => t.status === taskStatus)}
								/>
							))}
						</SortableContext>
					</div>
				</div>
			</DndContext>
		</div>
	)
}

export default ProjectKanbanBoard
