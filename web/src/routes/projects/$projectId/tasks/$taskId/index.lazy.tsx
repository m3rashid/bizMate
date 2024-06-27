import apiClient from '../../../../../api/client'
import Button from '../../../../../components/lib/button'
import { PageLoader } from '../../../../../components/lib/loader'
import PageContainer from '../../../../../components/pageContainer'
import AddProjectTask from '../../../../../components/projects/addProjectTask'
import { usePaginate } from '../../../../../hooks/paginate'
import { ProjectTask } from '../../../../../types'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute('/projects/$projectId/tasks/$taskId/')({
	component: TaskDetails,
})

function TaskDetails() {
	const navigate = useNavigate({ from: '/projects/$projectId/tasks/$taskId' })
	const [modalOpen, setModalOpen] = useState(false)
	const { projectId, taskId } = useParams({ from: '/projects/$projectId/tasks/$taskId/' })

	const { data: projectTaskDetails, isPending: isProjectTaskFetchPending } = useQuery<ProjectTask>({
		queryKey: ['getProjectTaskDetails', taskId],
		queryFn: () => apiClient(`/tasks/one/${taskId}`),
	})

	const { docs: childrenProjectTasks, refetch } = usePaginate<ProjectTask>({
		queryKeys: ['getProjectTaskChildren', taskId],
		url: `/tasks/children?parentTaskId=${taskId}`,
	})

	if (isProjectTaskFetchPending || !projectTaskDetails) return <PageLoader />

	return (
		<PageContainer>
			<AddProjectTask refetch={refetch} modalOpen={modalOpen} setModalOpen={setModalOpen} projectId={projectId} parentTaskId={parseInt(taskId)} />

			<h1 className="text-xl font-bold">{projectTaskDetails.title}</h1>
			<Button size="small" onClick={() => setModalOpen(true)}>
				Create Sub Task
			</Button>

			<div className="mt-4 flex flex-col gap-2">
				{(childrenProjectTasks || []).map((task) => (
					<div
						className="cursor-pointer"
						key={task.id}
						onClick={() => navigate({ to: '/projects/$projectId/tasks/$taskId', params: { projectId, taskId: task.id.toString() } })}
					>
						{task.title}
					</div>
				))}
			</div>
		</PageContainer>
	)
}
