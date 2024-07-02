import DashboardDesignerComponent from '@components/dashboardDesigner'
import PageContainer from '@components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/dashboards/$dashboardId/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	const { dashboardId, workspaceId } = useParams({ from: '/$workspaceId/dashboards/$dashboardId/designer' })

	return (
		<PageContainer workspaceId={workspaceId}>
			<DashboardDesignerComponent dashboardId={dashboardId} workspaceId={workspaceId} />
		</PageContainer>
	)
}
