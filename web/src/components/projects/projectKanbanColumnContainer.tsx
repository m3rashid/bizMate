import { SortableContext } from '@dnd-kit/sortable'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'

import ProjectTaskCard from './projectTaskCard'
import { ProjectTask, TaskStatus } from '../../types'
import { capitalizeFirstLetter } from '../../utils/helpers'

export type ColumnContainerProps = {
	projectId: string
	taskStatus: TaskStatus
	tasks?: ProjectTask[]
	onAddTask: () => void
	refetch: () => void
}

function ColumnContainer(props: ColumnContainerProps) {
	return (
		<div className="mr-1 flex h-full max-h-[800px] min-h-80 w-[350px] flex-col rounded-md">
			<div className="text-md flex h-[60px] items-center justify-between gap-2 rounded-md rounded-b-none border-2 border-primaryLight p-3 font-bold">
				<div className="flex items-center justify-center rounded-full text-sm">0</div>
				{capitalizeFirstLetter(props.taskStatus)}
				<div className="cursor-pointer rounded-full bg-primary p-1" onClick={props.onAddTask}>
					<PlusIcon className="h-6 w-6 text-white" />
				</div>
			</div>

			<div className="mb-4 flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden rounded-b-md bg-slate-100 p-2">
				<SortableContext items={(props.tasks || []).map((t) => t.id)}>
					{(props.tasks || []).map((task) => (
						<ProjectTaskCard key={task.id} task={task} onDelete={props.refetch} />
					))}
				</SortableContext>
			</div>
		</div>
	)
}

export default ColumnContainer
