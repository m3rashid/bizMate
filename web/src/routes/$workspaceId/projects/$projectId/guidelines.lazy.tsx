import PageContainer from '@components/pageContainer'
import EditProjectDetails from '@components/projects/editProjectDetails'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/projects/$projectId/guidelines')({
	component: ProjectGuidelines,
})

function ProjectGuidelines() {
	const { projectId, workspaceId } = useParams({ from: '/$workspaceId/projects/$projectId/guidelines' })

	return (
		<PageContainer workspaceId={workspaceId}>
			<EditProjectDetails {...{ projectId, type: 'guidelines', workspaceId }} />
		</PageContainer>
	)
}
