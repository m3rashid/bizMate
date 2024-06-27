import apiClient from '../../../api/client'
import { PageLoader } from '../../../components/lib/loader'
import PageContainer from '../../../components/pageContainer'
import ProjectHeader from '../../../components/projects/projectHeader'
import { Project } from '../../../types'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/projects/$projectId/')({
	component: ProjectDetails,
})

function ProjectDetails() {
	const { projectId } = useParams({ from: '/projects/$projectId/' })

	const { data: project, isPending } = useQuery<Project>({
		queryKey: ['getProject', projectId],
		queryFn: () => apiClient(`/projects/one/${projectId}`),
	})

	if (isPending || !project) return <PageLoader />

	return (
		<PageContainer>
			<ProjectHeader {...project} />
		</PageContainer>
	)
}
