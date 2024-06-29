import apiClient from '../../api/client'
import { DashboardChart, PaginationResponse } from '../../types'
import RenderKpi from './renderKpi'
import { useQuery } from '@tanstack/react-query'

type ShowDashboardProps = {
	dashboardId: string | number
}

function ShowDashboard(props: ShowDashboardProps) {
	const { data: paginatedWidgets } = useQuery<PaginationResponse<DashboardChart>>({
		queryKey: ['dashboards/widgets', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/widgets/${props.dashboardId}/all`),
	})

	const { data: allKpis } = useQuery<Array<{ title: string; description: string; data: number }>>({
		queryKey: ['dashboards/kpis', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/kpis/${props.dashboardId}/all`),
	})

	return (
		<div className="mt-8 flex flex-wrap gap-4">
			{(allKpis || []).map((kpi, index) => (
				<RenderKpi key={kpi.title + index} data={kpi.data} title={kpi.title} description={kpi.description} />
			))}
		</div>
	)
}

export default ShowDashboard
