import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { ChartBarIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline'

import apiClient from '../../../../api/client'
import Tabs from '../../../../components/lib/tab'
import Chip from '../../../../components/lib/chip'
import { PageLoader } from '../../../../components/lib/loader'
import PageContainer from '../../../../components/pageContainer'
import FormView from '../../../../components/apps/forms/formView'
import { PageNotFound } from '../../../../components/lib/notFound'
import FormResponses from '../../../../components/apps/forms/responses'
import FormAnalytics from '../../../../components/apps/forms/analytics'

export const Route = createFileRoute('/apps/forms/$formId/details')({
	component: FormPreview,
})

function FormPreview() {
	const { formId } = useParams({ from: '/apps/forms/$formId/details' })

	const { data: form, isPending } = useQuery({
		queryKey: ['getForm', formId],
		queryFn: () => apiClient(`/forms/one/${formId}`, { method: 'GET' }),
	})

	const { data: responseCountData, isPending: isCountPending } = useQuery({
		queryKey: ['getFormResponseCount', formId],
		queryFn: () => apiClient(`/forms/response/${formId}/count`, { method: 'GET' }),
	})

	if (!formId || isNaN(parseInt(formId))) return <PageNotFound />
	if (isPending || isCountPending) return <PageLoader />

	return (
		<PageContainer>
			<Tabs
				tabs={[
					{
						id: 'preview',
						label: (
							<div className="flex w-20 items-center justify-center gap-3">
								<EyeIcon className="h-4 w-4" />
								<span>Preview</span>
							</div>
						),
						Component: FormView,
						componentProps: { type: 'preview', form },
					},
					{
						id: 'response',
						label: (
							<div className="relative flex items-center justify-center gap-3 pr-1">
								<DocumentTextIcon className="h-4 w-4" />
								<span>Responses</span>
								<Chip className="absolute -right-6 -top-6 rounded-full bg-dangerLight">{responseCountData.count}</Chip>
							</div>
						),
						Component: FormResponses,
						componentProps: { form },
					},
					{
						id: 'analytics',
						label: (
							<div className="flex w-20 items-center justify-center gap-3">
								<ChartBarIcon className="h-4 w-4" />
								<span>Analytics</span>
							</div>
						),
						Component: FormAnalytics,
						componentProps: { form },
					},
				]}
			/>
		</PageContainer>
	)
}
