import 'chart.js/auto'
import { Pie } from 'react-chartjs-2'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import apiClient from '../../../../api/client'
import { PageLoader } from '../../../../components/lib/loader'
import { NotFound } from '../../../../components/lib/notFound'
import PageContainer from '../../../../components/pageContainer'
import Tooltip from '../../../../components/lib/tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import DataListHeader from '../../../../components/lib/dataListHeader'

export const Route = createLazyFileRoute('/apps/forms/$formId/analytics')({
	component: FormAnalytics,
})

type BooleanAnalysisResponse = Array<{ name: string; label: string; trueCount: number; falseCount: number }>
function FormAnalytics() {
	const { formId } = useParams({ from: '/apps/forms/$formId/analytics' })

	const { data, isPending } = useQuery<BooleanAnalysisResponse>({
		queryKey: ['getFormAnalysis', formId],
		queryFn: () => apiClient(`/forms/analysis/${formId}`),
	})

	if (isPending) return <PageLoader />
	if (!data) return <NotFound />

	return (
		<PageContainer>
			<DataListHeader hideRefresh isFetching={false} refetch={() => {}} title="Form Analytics" />

			<div className="flex flex-wrap items-center gap-4">
				{data.map((analysis) => (
					<div key={analysis.name} className="w-full rounded-md p-4 shadow-md sm:max-w-xs">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-disabled">{analysis.label}</h3>
							<Tooltip label={`${analysis.trueCount} voted true for ${analysis.label}`} show="right">
								<InformationCircleIcon className="h-5 w-5 text-disabled" />
							</Tooltip>
						</div>

						<Pie
							options={{ plugins: { legend: { display: false } } }}
							data={{ labels: ['True', 'False'], datasets: [{ data: [analysis.trueCount, analysis.falseCount] }] }}
						/>
					</div>
				))}
			</div>
		</PageContainer>
	)
}
