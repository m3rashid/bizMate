import PageContainer from '../../../components/pageContainer'
import EditProjectDetails from '../../../components/projects/editProjectDetails'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/projects/$projectId/docs')({
	component: ProjectDocumentation,
})

function ProjectDocumentation() {
	const { projectId } = useParams({ from: '/projects/$projectId/docs' })
	return (
		<PageContainer>
			<EditProjectDetails {...{ projectId, type: 'docs' }} />
		</PageContainer>
	)
}
