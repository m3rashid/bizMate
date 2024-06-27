import apiClient from '../../../api/client'
import AnalyticsCard, { Analysis, ChartType } from '../../../components/apps/forms/analyticsCard'
import Button from '../../../components/lib/button'
import DataListHeader from '../../../components/lib/dataListHeader'
import { PageLoader } from '../../../components/lib/loader'
import { NotFound } from '../../../components/lib/notFound'
import PageContainer from '../../../components/pageContainer'
import { handleViewTransition } from '../../../utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute('/forms/$formId/analytics')({
	component: FormAnalytics,
})

type AnalysisResponse = {
	title: string
	description: string
	analysis: Analysis[]
}
function FormAnalytics() {
	const [chartType, setChartType] = useState<ChartType>('pie')
	const { formId } = useParams({ from: '/forms/$formId/analytics' })

	const { data, isPending } = useQuery<AnalysisResponse>({
		queryKey: ['getFormAnalysis', formId],
		queryFn: () => apiClient(`/forms/analysis/${formId}`),
	})

	if (isPending) return <PageLoader />
	if (!data) return <NotFound />

	return (
		<PageContainer>
			<DataListHeader
				hideRefresh
				isFetching={false}
				refetch={() => {}}
				title={`Form Analytics (${data.title})`}
				description={data.description}
				otherActions={
					<div>
						<Button onClick={() => handleViewTransition(() => setChartType((p) => (p === 'pie' ? 'bar' : 'pie')))} size="small">
							{chartType === 'pie' ? 'Show as Bar Charts' : 'Show as Pie Charts'}
						</Button>
					</div>
				}
			/>

			<div className="flex flex-wrap items-stretch gap-4">
				{data.analysis.map((dataPoint) => {
					return <AnalyticsCard key={dataPoint.name} analytics={dataPoint} chartType={chartType} />
				})}
			</div>
		</PageContainer>
	)
}
