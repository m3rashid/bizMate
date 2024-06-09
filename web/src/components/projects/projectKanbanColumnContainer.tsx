import { useMemo } from 'react'
import { SortableContext } from '@dnd-kit/sortable'
import { PlusIcon } from '@heroicons/react/24/outline'

import { TaskStatus } from '../../types'
import ProjectTaskCard from './projectTaskCard'
import AddEditProjectTask from './addEditProjectTask'
import { capitalizeFirstLetter } from '../../utils/helpers'
import { useProjectKanban } from '../../hooks/projectKanban'

export type ColumnContainerProps = {
	projectId: string
	taskStatus: TaskStatus
}

function ColumnContainer(props: ColumnContainerProps) {
	const { onAddTask, projectKanban } = useProjectKanban()

	const currentStatusTasks = useMemo(() => {
		if (projectKanban.tasksFetchpending) return []
		const tasks = (projectKanban.tasks || []).filter((task) => task.status === props.taskStatus)
		// console.log(tasks)
		return tasks
	}, [props.taskStatus, props.projectId])

	return (
		<>
			<AddEditProjectTask />
			<div className="mr-1 flex h-full max-h-[800px] min-h-80 w-[350px] flex-col rounded-md">
				<div className="text-md flex h-[60px] items-center justify-between gap-2 rounded-md rounded-b-none border-2 border-primaryLight p-3 font-bold">
					<div className="flex items-center justify-center rounded-full text-sm">0</div>
					{capitalizeFirstLetter(props.taskStatus)}
					<div className="cursor-pointer rounded-full bg-primary p-1" onClick={onAddTask}>
						<PlusIcon className="h-6 w-6 text-white" />
					</div>
				</div>

				<div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
					<SortableContext items={currentStatusTasks.map((t) => t.id)}>
						{currentStatusTasks.map((task) => (
							<ProjectTaskCard key={task.id} task={task} />
						))}
					</SortableContext>
				</div>
			</div>
		</>
	)
}

export default ColumnContainer
