import Button from '../../lib/button'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import 'chart.js/auto'
import { useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { twMerge } from 'tailwind-merge'

export type ChartType = 'pie' | 'bar'
export type Analysis = { name: string; label: string; counts: Record<string, number> }

type AnalyticsCardProps = {
	analytics: Analysis
	defaultChartType?: ChartType
} & ({ position: 'modal' } | { position: 'card'; maximize: (chartType: ChartType) => void })

const borderColor = ['#FB7185', '#4ADE80', '#22D3EE', '#9CA3AF', '#A78BFA', '#9333EA', '#2563EB', '#DB2777']
const backgroundColor = borderColor.map((t) => t + '80')

function AnalyticsCard(props: AnalyticsCardProps) {
	const [showOptions, setShowOptions] = useState(false)
	const [chartType, setChartType] = useState<ChartType>(props.defaultChartType || 'pie')
	const scoreArr = Object.entries(props.analytics.counts).reduce<Array<[string, number]>>((acc, [key, value]) => [...acc, [key, value]], [])

	return (
		<div
			className="relative flex h-full flex-col justify-between"
			onMouseEnter={() => setShowOptions(true)}
			onMouseLeave={() => setShowOptions(false)}
		>
			<h3 className="mb-4 font-semibold text-disabled">{props.analytics.label}</h3>

			{showOptions ? (
				<div
					className={twMerge(
						'absolute right-0 flex w-full items-center justify-between gap-2',
						props.position === 'card' ? 'top-8 flex-row' : 'top-0 flex-row-reverse',
					)}
				>
					<Button variant="simple" size="small" onClick={() => setChartType((prev) => (prev === 'bar' ? 'pie' : 'bar'))}>
						{chartType === 'pie' ? 'Show Bar Chart' : 'Show Pie Chart'}
					</Button>
					{props.position === 'card' ? (
						<Button
							variant="simple"
							size="small"
							onClick={() => props.maximize(chartType)}
							LeftIcon={<ArrowsPointingOutIcon className="h-6 w-6" />}
						/>
					) : null}
				</div>
			) : null}

			<div className={twMerge('flex items-center justify-center p-4', props.position === 'card' ? 'h-96' : 'h-[500px]')}>
				{chartType === 'pie' ? (
					<Pie
						options={{ plugins: { legend: { display: false } }, cutout: '5%' }}
						data={{
							labels: scoreArr.map((t) => t[0]),
							datasets: [{ data: scoreArr.map((t) => t[1]), backgroundColor }],
						}}
					/>
				) : (
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
						data={{
							labels: scoreArr.map((t) => t[0]),
							datasets: [{ data: scoreArr.map((t) => t[1]), backgroundColor, borderColor: borderColor, borderRadius: 5 }],
						}}
					/>
				)}
			</div>
		</div>
	)
}

export default AnalyticsCard
