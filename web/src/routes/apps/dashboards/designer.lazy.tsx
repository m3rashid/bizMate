import { createLazyFileRoute } from '@tanstack/react-router'

import { DashboardDesignerProvider } from '../../../hooks/dashboardDesigner'
import DashboardDesignerComponent from '../../../components/dashboardDesigner'

export const Route = createLazyFileRoute('/apps/dashboards/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	return (
		<DashboardDesignerProvider>
			<DashboardDesignerComponent />
		</DashboardDesignerProvider>
	)
}
