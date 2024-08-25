'use client';

import { Button } from '@/components/lib/button';
import { Tooltip } from '@/components/lib/tooltip';
import ArrowsPointingOutIcon from '@heroicons/react/24/outline/ArrowsPointingOutIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import ChartPieIcon from '@heroicons/react/24/outline/ChartPieIcon';
import 'chart.js/auto';
import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { twMerge } from 'tailwind-merge';

export type ChartType = 'pie' | 'bar';
export type Analysis = { name: string; label: string; counts: Record<string, number> };

type AnalyticsCardProps = {
	analytics: Analysis;
	defaultChartType?: ChartType;
} & ({ position: 'modal' } | { position: 'card'; maximize: (chartType: ChartType) => void });

const borderColor = ['#FB7185', '#4ADE80', '#22D3EE', '#9CA3AF', '#A78BFA', '#9333EA', '#2563EB', '#DB2777'];
const backgroundColor = borderColor.map((t) => t + '80');

export function AnalyticsCard(props: AnalyticsCardProps) {
	const [chartType, setChartType] = useState<ChartType>(props.defaultChartType || 'pie');
	const scoreArr = Object.entries(props.analytics.counts).reduce<Array<[string, number]>>((acc, [key, value]) => [...acc, [key, value]], []);

	return (
		<div className='relative flex h-full flex-col justify-between'>
			<div className={props.position === 'card' ? 'flex w-full items-center justify-between' : 'relative'}>
				{props.position === 'card' ? <h3 className='mb-1.5 mt-1.5 font-semibold text-disabled'>{props.analytics.label}</h3> : null}

				<div className={props.position === 'card' ? 'flex items-center gap-2' : 'absolute right-0'}>
					<Tooltip label={chartType === 'pie' ? 'Switch to bar chart' : 'Switch to pie chart'}>
						<Button variant='simple' size='small' onClick={() => setChartType((prev) => (prev === 'bar' ? 'pie' : 'bar'))}>
							{chartType === 'pie' ? <ChartBarIcon className='h-5 w-5' /> : <ChartPieIcon className='h-5 w-5' />}
						</Button>
					</Tooltip>

					{props.position === 'card' ? (
						<Tooltip label='Maximize'>
							<Button
								size='small'
								variant='simple'
								onClick={() => props.maximize(chartType)}
								LeftIcon={<ArrowsPointingOutIcon className='h-5 w-5' />}
							/>
						</Tooltip>
					) : null}
				</div>
			</div>

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
	);
}
