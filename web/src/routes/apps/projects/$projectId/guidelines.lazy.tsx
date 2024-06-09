import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import PageContainer from '../../../../components/pageContainer'
import EditProjectDetails from '../../../../components/projects/editProjectDetails'

export const Route = createLazyFileRoute('/apps/projects/$projectId/guidelines')({
	component: ProjectGuidelines,
})

function ProjectGuidelines() {
	const { projectId } = useParams({ from: '/apps/projects/$projectId/guidelines' })

	return (
		<PageContainer>
			<EditProjectDetails {...{ projectId, type: 'guidelines' }} />
		</PageContainer>
	)
}
