import PageContainer from '@components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/projects/$projectId/analytics')({
	component: ProjectAnalytics,
})

function ProjectAnalytics() {
	const { workspaceId } = useParams({ from: '/$workspaceId/projects/$projectId/analytics' })
	return (
		<PageContainer workspaceId={workspaceId}>
			<div>Hello /projects/$projectId/analytics!</div>
		</PageContainer>
	)
}
