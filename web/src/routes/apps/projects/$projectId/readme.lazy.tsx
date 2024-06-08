import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import { Project } from '../../../../types'
import apiClient from '../../../../api/client'
import Chip from '../../../../components/lib/chip'
import { PageLoader } from '../../../../components/lib/loader'
import PageContainer from '../../../../components/pageContainer'
import ShowRichText from '../../../../components/lib/showRichText'

export const Route = createLazyFileRoute('/apps/projects/$projectId/readme')({
	component: ProjectReadme,
})

function ProjectReadme() {
	const { projectId } = useParams({ from: '/apps/projects/$projectId/readme' })

	const { data: project, isPending } = useQuery<Project>({
		queryKey: ['getProject', projectId],
		queryFn: () => apiClient(`/projects/one/${projectId}`),
	})

	if (isPending || !project) return <PageLoader />

	return (
		<PageContainer>
			{project.readme ? (
				<div className="relative">
					<Chip className="absolute right-2 top-2 z-50 border-2 bg-transparent text-black">Readme</Chip>
					<ShowRichText data={project.readme} />
				</div>
			) : null}
		</PageContainer>
	)
}
