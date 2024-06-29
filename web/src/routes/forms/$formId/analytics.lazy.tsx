import apiClient from '../../../api/client'
import AnalyticsCard, { Analysis } from '../../../components/apps/forms/analyticsCard'
import DataListHeader from '../../../components/lib/dataListHeader'
import { PageLoader } from '../../../components/lib/loader'
import Modal from '../../../components/lib/modal'
import { NotFound } from '../../../components/lib/notFound'
import PageContainer from '../../../components/pageContainer'
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
	const [analyticDetail, setAnalyticDetail] = useState<Analysis | null>(null)
	const { formId } = useParams({ from: '/forms/$formId/analytics' })

	const { data, isPending } = useQuery<AnalysisResponse>({
		queryKey: ['getFormAnalysis', formId],
		queryFn: () => apiClient(`/forms/analysis/${formId}`),
	})

	if (isPending) return <PageLoader />
	if (!data) return <NotFound />

	return (
		<PageContainer>
			<DataListHeader hideRefresh isFetching={false} refetch={() => {}} title={`Form Analytics (${data.title})`} description={data.description} />

			<Modal title={analyticDetail?.label} open={!!analyticDetail} setOpen={() => setAnalyticDetail(null)}>
				<div className="p-4">{analyticDetail ? <AnalyticsCard analytics={analyticDetail} position="modal" /> : null}</div>
			</Modal>

			<div className="flex flex-wrap items-stretch gap-4">
				{data.analysis.map((dataPoint) => {
					return (
						<div
							key={dataPoint.name}
							className="min-h-64 w-full select-none rounded-md border-2 border-white p-2 shadow-lg hover:border-primary sm:max-w-xs md:max-w-md"
						>
							<AnalyticsCard position="card" analytics={dataPoint} maximize={() => setAnalyticDetail(dataPoint)} />
						</div>
					)
				})}
			</div>
		</PageContainer>
	)
}
