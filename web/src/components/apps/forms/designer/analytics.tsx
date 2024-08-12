'use client';

import { Analysis, AnalyticsCard, ChartType } from '@/components/apps/forms/designer/analyticsCard';
import { Modal } from '@/components/lib/modal';
import { useState } from 'react';

export function FormAnalyticsGraphs(props: { analysis: Analysis[] }) {
	const [detailAnalytic, setDetailAnalytic] = useState<{ analysis: Analysis; chartType: ChartType } | null>(null);

	return (
		<>
			<Modal title={detailAnalytic?.analysis.label} open={!!detailAnalytic} setOpen={() => setDetailAnalytic(null)}>
				<div className='p-4'>
					{detailAnalytic ? (
						<AnalyticsCard defaultChartType={detailAnalytic.chartType} analytics={detailAnalytic?.analysis} position='modal' />
					) : null}
				</div>
			</Modal>

			<div className='flex flex-wrap items-stretch gap-4'>
				{props.analysis.map((dataPoint) => {
					return (
						<div
							key={dataPoint.name}
							className='min-h-64 w-full select-none rounded-md border-2 border-white bg-white p-2 shadow-lg hover:border-primary sm:max-w-xs md:max-w-md'
						>
							<AnalyticsCard position='card' analytics={dataPoint} maximize={(chartType) => setDetailAnalytic({ chartType, analysis: dataPoint })} />
						</div>
					);
				})}
			</div>
		</>
	);
}
