import PageContainer from '@components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/dashboards/$dashboardId/')({
	component: PreviewDashboard,
})

function PreviewDashboard() {
	const { dashboardId } = useParams({ from: '/$workspaceId/dashboards/$dashboardId/' })

	return (
		<PageContainer>
			<div>Hello /dashboards/$dashboardId/!</div>
		</PageContainer>
	)
}
