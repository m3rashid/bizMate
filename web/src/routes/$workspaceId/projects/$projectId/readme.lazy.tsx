import PageContainer from '@components/pageContainer'
import EditProjectDetails from '@components/projects/editProjectDetails'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/projects/$projectId/readme')({
	component: ProjectReadme,
})

function ProjectReadme() {
	const { projectId, workspaceId } = useParams({ from: '/$workspaceId/projects/$projectId/readme' })

	return (
		<PageContainer workspaceId={workspaceId}>
			<EditProjectDetails {...{ projectId, type: 'readme', workspaceId }} />
		</PageContainer>
	)
}
