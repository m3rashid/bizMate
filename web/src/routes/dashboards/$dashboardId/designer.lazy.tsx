import DashboardDesignerComponent from '../../../components/dashboardDesigner'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/$dashboardId/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	return <DashboardDesignerComponent />
}
