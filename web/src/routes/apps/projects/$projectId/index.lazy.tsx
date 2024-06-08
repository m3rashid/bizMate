import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import { Project } from '../../../../types'
import apiClient from '../../../../api/client'
import { PageLoader } from '../../../../components/lib/loader'
import PageContainer from '../../../../components/pageContainer'
import EditProjectDetails from '../../../../components/projects/editProjectDetails'
import ShowRichText from '../../../../components/lib/showRichText'
import Chip from '../../../../components/lib/chip'

export const Route = createLazyFileRoute('/apps/projects/$projectId/')({
	component: ProjectDetails,
})

function ProjectDetails() {
	const { projectId } = useParams({ from: '/apps/projects/$projectId/' })

	const { data: project, isPending } = useQuery<Project>({
		queryKey: ['getProject', projectId],
		queryFn: () => apiClient(`/projects/one/${projectId}`),
	})

	if (isPending || !project) return <PageLoader />

	return (
		<PageContainer>
			<EditProjectDetails {...project} />
		</PageContainer>
	)
}
