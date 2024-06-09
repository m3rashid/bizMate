import { SortableContext } from '@dnd-kit/sortable'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import { usePaginate } from '../../hooks/paginate'
import { ProjectTask, taskStatuses } from '../../types'
import ColumnContainer from './projectKanbanColumnContainer'
import { useProjectKanban } from '../../hooks/projectKanban'

export type ProjectKanbanBoardProps = {
	projectId: string
}

function ProjectKanbanBoard(props: ProjectKanbanBoardProps) {
	const { docs } = usePaginate<ProjectTask>({ url: `/projects/${props.projectId}/tasks/all`, queryKeys: ['getProjectTasks', props.projectId] })
	const { onDragEnd, onDragOver, onDragStart } = useProjectKanban()
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }))

	return (
		<div className="mt-4 max-w-max overflow-x-auto">
			<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
				<div className="m-auto flex gap-4">
					<div className="flex gap-4">
						<SortableContext items={taskStatuses as any}>
							{taskStatuses.map((taskStatus) => (
								<ColumnContainer
									key={taskStatus}
									taskStatus={taskStatus}
									projectId={props.projectId}
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
