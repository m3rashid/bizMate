import { DashboardKpi } from '../../types'

type RenderKpiProps = {
	kpi: DashboardKpi
	data: number
}

function RenderKpi({ data, kpi }: RenderKpiProps) {
	return (
		<div className="">
			<h2>{kpi.title}</h2>
			<p>{kpi.description}</p>

			<div className="h-80 items-center justify-center">{data}</div>
		</div>
	)
}

export default RenderKpi
