import apiClient from '@api/client'
import AnalyticsCard, { Analysis, ChartType } from '@components/apps/forms/analyticsCard'
import DataListHeader from '@components/lib/dataListHeader'
import { PageLoader } from '@components/lib/loader'
import Modal from '@components/lib/modal'
import { NotFound } from '@components/lib/notFound'
import PageContainer from '@components/pageContainer'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute('/$workspaceId/forms/$formId/analytics')({
	component: FormAnalytics,
})

type AnalysisResponse = {
	title: string
	description: string
	analysis: Analysis[]
}
function FormAnalytics() {
	const [detailAnalytic, setDetailAnalytic] = useState<{ analysis: Analysis; chartType: ChartType } | null>(null)
	const { formId } = useParams({ from: '/$workspaceId/forms/$formId/analytics' })

	const { data, isPending } = useQuery<AnalysisResponse>({
		queryKey: ['getFormAnalysis', formId],
		queryFn: () => apiClient(`/forms/analysis/${formId}`),
	})

	if (isPending) return <PageLoader />
	if (!data) return <NotFound />

	return (
		<PageContainer>
			<DataListHeader hideRefresh isFetching={false} refetch={() => {}} title={`Form Analytics (${data.title})`} description={data.description} />

			<Modal title={detailAnalytic?.analysis.label} open={!!detailAnalytic} setOpen={() => setDetailAnalytic(null)}>
				<div className="p-4">
					{detailAnalytic ? (
						<AnalyticsCard defaultChartType={detailAnalytic.chartType} analytics={detailAnalytic?.analysis} position="modal" />
					) : null}
				</div>
			</Modal>

			<div className="flex flex-wrap items-stretch gap-4">
				{data.analysis.map((dataPoint) => {
					return (
						<div
							key={dataPoint.name}
							className="min-h-64 w-full select-none rounded-md border-2 border-white p-2 shadow-lg hover:border-primary sm:max-w-xs md:max-w-md"
						>
							<AnalyticsCard position="card" analytics={dataPoint} maximize={(chartType) => setDetailAnalytic({ chartType, analysis: dataPoint })} />
						</div>
					)
				})}
			</div>
		</PageContainer>
	)
}
