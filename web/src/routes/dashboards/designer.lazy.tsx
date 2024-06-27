import DashboardDesignerComponent from '../../components/dashboardDesigner'
import { DashboardDesignerProvider } from '../../hooks/dashboardDesigner'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	return (
		<DashboardDesignerProvider>
			<DashboardDesignerComponent />
		</DashboardDesignerProvider>
	)
}
