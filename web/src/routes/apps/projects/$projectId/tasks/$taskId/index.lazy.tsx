import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate, useParams } from '@tanstack/react-router'

import apiClient from '../../../../../../api/client'
import { ProjectTask } from '../../../../../../types'
import Button from '../../../../../../components/lib/button'
import { usePaginate } from '../../../../../../hooks/paginate'
import { PageLoader } from '../../../../../../components/lib/loader'
import PageContainer from '../../../../../../components/pageContainer'
import AddProjectTask from '../../../../../../components/projects/addProjectTask'

export const Route = createLazyFileRoute('/apps/projects/$projectId/tasks/$taskId/')({
	component: TaskDetails,
})

function TaskDetails() {
	const navigate = useNavigate({ from: '/apps/projects/$projectId/tasks/$taskId' })
	const [modalOpen, setModalOpen] = useState(false)
	const { projectId, taskId } = useParams({ from: '/apps/projects/$projectId/tasks/$taskId/' })

	const { data: projectTaskDetails, isPending: isProjectTaskFetchPending } = useQuery<ProjectTask>({
		queryKey: ['getProjectTaskDetails', taskId],
		queryFn: () => apiClient(`/tasks/one/${taskId}`),
	})

	const { docs: childrenProjectTasks } = usePaginate<ProjectTask>({
		queryKeys: ['getProjectTaskChildren', taskId],
		url: `/tasks/children?parentTaskId=${taskId}`,
	})

	if (isProjectTaskFetchPending || !projectTaskDetails) return <PageLoader />

	return (
		<PageContainer>
			<AddProjectTask modalOpen={modalOpen} setModalOpen={setModalOpen} projectId={projectId} parentTaskId={parseInt(taskId)} />

			<h1 className="text-xl font-bold">{projectTaskDetails.title}</h1>
			<Button size="small" onClick={() => setModalOpen(true)}>
				Create Sub Task
			</Button>

			<div className="mt-4 flex flex-col gap-2">
				{(childrenProjectTasks || []).map((task) => (
					<div className="cursor-pointer" key={task.id} onClick={() => navigate({ to: `/apps/projects/${projectId}/tasks/${task.id}` })}>
						{task.title}
					</div>
				))}
			</div>
		</PageContainer>
	)
}
