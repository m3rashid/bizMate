import { createLazyFileRoute } from '@tanstack/react-router'

import { DashboardDesignerProvider } from '../../../hooks/dashboardDesigner'
import DashboardDesignerComponent from '../../../components/dashboardDesigner'

export const Route = createLazyFileRoute('/apps/dashboard/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	return (
		<DashboardDesignerProvider>
			<DashboardDesignerComponent />
		</DashboardDesignerProvider>
	)
}
