import DashboardDesignerComponent from '@components/dashboardDesigner'
import PageContainer from '@components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/dashboards/$dashboardId/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	const { dashboardId } = useParams({ from: '/$workspaceId/dashboards/$dashboardId/designer' })

	return (
		<PageContainer>
			<DashboardDesignerComponent dashboardId={dashboardId} />
		</PageContainer>
	)
}
