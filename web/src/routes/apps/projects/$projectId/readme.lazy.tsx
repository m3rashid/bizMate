import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import PageContainer from '../../../../components/pageContainer'
import EditProjectDetails from '../../../../components/projects/editProjectDetails'

export const Route = createLazyFileRoute('/apps/projects/$projectId/readme')({
	component: ProjectReadme,
})

function ProjectReadme() {
	const { projectId } = useParams({ from: '/apps/projects/$projectId/readme' })

	return (
		<PageContainer>
			<EditProjectDetails {...{ projectId, type: 'readme' }} />
		</PageContainer>
	)
}
