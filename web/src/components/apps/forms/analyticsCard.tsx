import 'chart.js/auto'
import { Bar, Pie } from 'react-chartjs-2'

export type ChartType = 'pie' | 'bar'
export type Analysis = { name: string; label: string; counts: Record<string, number> }

type AnalyticsCardProps = {
	analytics: Analysis
	chartType: ChartType
}

function AnalyticsCard(props: AnalyticsCardProps) {
	const scoreArr = Object.entries(props.analytics.counts).reduce<Array<[string, number]>>((acc, [key, value]) => [...acc, [key, value]], [])

	return (
		<div
			key={props.analytics.name}
			className="flex w-full select-none flex-col justify-between rounded-lg border-2 border-white p-2 shadow-lg hover:border-primary sm:max-w-xs"
		>
			<h3 className="mb-4 font-semibold text-disabled">{props.analytics.label}</h3>

			<div className="p-4">
				{props.chartType === 'pie' ? (
					<Pie
						options={{ plugins: { legend: { display: false } } }}
						data={{ labels: scoreArr.map((t) => t[0]), datasets: [{ data: scoreArr.map((t) => t[1]) }] }}
					/>
				) : (
					<Bar
						options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
						data={{ labels: scoreArr.map((t) => t[0]), datasets: [{ data: scoreArr.map((t) => t[1]) }] }}
					/>
				)}
			</div>
		</div>
	)
}

export default AnalyticsCard
