import DashboardDesignerComponent from '../../../components/dashboardDesigner'
import PageContainer from '../../../components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/$dashboardId/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	const { dashboardId } = useParams({ from: '/dashboards/$dashboardId/designer' })

	return (
		<PageContainer>
			<DashboardDesignerComponent dashboardId={dashboardId} />
		</PageContainer>
	)
}
