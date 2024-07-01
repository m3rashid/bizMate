import apiClient from '../../api/client'
import { DashboardChart, PaginationResponse } from '../../types'
import RenderKpi from './renderKpi'
import { useQuery } from '@tanstack/react-query'

type ShowDashboardProps = {
	dashboardId: string
	viewType: 'preview' | 'edit'
}

function ShowDashboard(props: ShowDashboardProps) {
	const { data: paginatedWidgets } = useQuery<PaginationResponse<DashboardChart>>({
		queryKey: ['dashboards/widgets', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/charts/${props.dashboardId}/all`),
	})

	const { data: allKpis } = useQuery<Array<{ id: string; title: string; description: string; data: number }>>({
		queryKey: ['dashboards/kpis', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/kpis/${props.dashboardId}/all`),
	})

	return (
		<div className="mt-8 flex flex-wrap gap-4">
			{(allKpis || []).map((kpi, index) => (
				<RenderKpi key={kpi.title + index} data={kpi.data} kpiId={kpi.id} title={kpi.title} description={kpi.description} viewType={props.viewType} />
			))}
		</div>
	)
}

export default ShowDashboard
