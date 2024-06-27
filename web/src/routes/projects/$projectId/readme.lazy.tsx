import PageContainer from '../../../components/pageContainer'
import EditProjectDetails from '../../../components/projects/editProjectDetails'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/projects/$projectId/readme')({
	component: ProjectReadme,
})

function ProjectReadme() {
	const { projectId } = useParams({ from: '/projects/$projectId/readme' })

	return (
		<PageContainer>
			<EditProjectDetails {...{ projectId, type: 'readme' }} />
		</PageContainer>
	)
}
