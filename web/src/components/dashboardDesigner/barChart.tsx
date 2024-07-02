import apiClient from '@api/client'
import { DashboardChart } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { Bar } from 'react-chartjs-2'

type BarChartProps = DashboardChart & {
	workspaceId: string
}

function BarChart(props: BarChartProps) {
	const { data } = useQuery({
		queryKey: [props.id, 'getBarChart', props.workspaceId],
		queryFn: () => apiClient(`/${props.workspaceId}/dashboards/data/${props.dashboardId}/${props.id}`),
	})

	console.log(data)

	return (
		<div className="flex w-full select-none flex-col justify-between rounded-md border-2 border-white p-2 shadow-lg hover:border-primary sm:max-w-xs">
			<h3 className="mb-4 font-semibold text-disabled">{props.title}</h3>
			<div className="mb-4 text-sm font-semibold text-disabled">{props.description}</div>

			<div className="p-4">
				<Bar
					options={{
						plugins: {
							legend: { display: false },
							tooltip: { enabled: false },
						},
						maintainAspectRatio: false,
						scales: {
							x: { border: { display: false }, grid: { display: false } },
							y: { border: { display: false }, grid: { display: false } },
						},
					}}
					data={{ datasets: [] }}
				/>
			</div>
		</div>
	)
}

export default BarChart
