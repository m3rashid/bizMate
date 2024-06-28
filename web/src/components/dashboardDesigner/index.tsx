import apiClient from '../../api/client'
import useAddDashboardWidget from '../../hooks/addDashboardWidget'
import { DashboardChart, DashboardKpi, PaginationResponse } from '../../types'
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

	const { data: allKpis } = useQuery<Array<{ kpi: DashboardKpi; data: number }>>({
		queryKey: ['dashboards/kpis', props.dashboardId, 'all'],
		queryFn: () => apiClient(`/dashboards/kpis/${props.dashboardId}/all`),
	})

	return (
		<>
			<Button size="small" onClick={openModal}>
				Add Widget
			</Button>
			<AddWidget dashboardId={props.dashboardId} />
			{(allKpis || []).map((singleKpi) => (
				<RenderKpi key={singleKpi.kpi.id} data={singleKpi.data} kpi={singleKpi.kpi} />
			))}
		</>
	)
}

export default DashboardDesigner
