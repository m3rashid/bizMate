import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import PageContainer from '../../../../components/pageContainer'
import EditProjectDetails from '../../../../components/projects/editProjectDetails'

export const Route = createLazyFileRoute('/apps/projects/$projectId/docs')({
	component: ProjectDocumentation,
})

function ProjectDocumentation() {
	const { projectId } = useParams({ from: '/apps/projects/$projectId/docs' })
	return (
		<PageContainer>
			<EditProjectDetails {...{ projectId, type: 'docs' }} />
		</PageContainer>
	)
}
