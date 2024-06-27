import apiClient from '../../../api/client'
import DashboardDesignerComponent from '../../../components/dashboardDesigner'
import PageContainer from '../../../components/pageContainer'
import { Kpi, PaginationResponse, Widget } from '../../../types'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/$dashboardId/designer')({
	component: DashboardDesigner,
})

function DashboardDesigner() {
	const { dashboardId } = useParams({ from: '/dashboards/$dashboardId/designer' })

	const { data: paginatedWidgets } = useQuery<PaginationResponse<Widget>>({
		queryKey: ['dashboards/widgets', dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/widgets/${dashboardId}/all`),
	})

	const { data: paginatedKpis } = useQuery<PaginationResponse<Kpi>>({
		queryKey: ['dashboards/kpis', dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/kpis/${dashboardId}/all`),
	})

	return (
		<PageContainer bodyClassName="p-0 sm:p-0 h-full">
			<DashboardDesignerComponent />
		</PageContainer>
	)
}
