import PageContainer from '@components/pageContainer'
import EditProjectDetails from '@components/projects/editProjectDetails'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/projects/$projectId/docs')({
	component: ProjectDocumentation,
})

function ProjectDocumentation() {
	const { projectId, workspaceId } = useParams({ from: '/$workspaceId/projects/$projectId/docs' })
	return (
		<PageContainer workspaceId={workspaceId}>
			<EditProjectDetails {...{ projectId, type: 'docs', workspaceId }} />
		</PageContainer>
	)
}
