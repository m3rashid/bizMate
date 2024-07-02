import apiClient from '@api/client'
import { PageLoader } from '@components/lib/loader'
import PageContainer from '@components/pageContainer'
import ProjectHeader from '@components/projects/projectHeader'
import { Project } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/projects/$projectId/')({
	component: ProjectDetails,
})

function ProjectDetails() {
	const { projectId, workspaceId } = useParams({ from: '/$workspaceId/projects/$projectId/' })

	const { data: project, isPending } = useQuery<Project>({
		queryKey: ['getProject', projectId, workspaceId],
		queryFn: () => apiClient(`/${workspaceId}/projects/one/${projectId}`),
	})

	if (isPending || !project) return <PageLoader />

	return (
		<PageContainer workspaceId={workspaceId}>
			<ProjectHeader project={project} workspaceId={workspaceId} />
		</PageContainer>
	)
}
