import apiClient from '../../api/client'
import useAddDashboardWidget from '../../hooks/addDashboardWidget'
import { DashboardChart, PaginationResponse } from '../../types'
import Button from '../lib/button'
import AddWidget from './addWidget'
import RenderKpi from './renderKpi'
import { useQuery } from '@tanstack/react-query'

function DashboardDesigner(props: { dashboardId: string | number }) {
	const { openModal } = useAddDashboardWidget()

	const { data: paginatedWidgets } = useQuery<PaginationResponse<DashboardChart>>({
		queryKey: ['dashboards/widgets', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/widgets/${props.dashboardId}/all`),
	})

	const { data: allKpis } = useQuery<Array<{ title: string; description: string; data: number }>>({
		queryKey: ['dashboards/kpis', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/kpis/${props.dashboardId}/all`),
	})

	return (
		<>
			<Button size="small" onClick={openModal}>
				Add Widget
			</Button>
			<AddWidget dashboardId={props.dashboardId} />

			<div className="mt-8 flex gap-4">
				{(allKpis || []).map((kpi, index) => (
					<RenderKpi key={kpi.title + index} data={kpi.data} title={kpi.title} description={kpi.description} />
				))}
			</div>
		</>
	)
}

export default DashboardDesigner
