import PageContainer from '@components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/dashboards/$dashboardId/')({
	component: PreviewDashboard,
})

function PreviewDashboard() {
	const { dashboardId, workspaceId } = useParams({ from: '/$workspaceId/dashboards/$dashboardId/' })

	return (
		<PageContainer workspaceId={workspaceId}>
			<div>Hello /dashboards/$dashboardId/!</div>
		</PageContainer>
	)
}
