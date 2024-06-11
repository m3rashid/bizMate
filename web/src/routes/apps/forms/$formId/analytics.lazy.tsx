import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

import { PageLoader } from '../../../../components/lib/loader'
import PageContainer from '../../../../components/pageContainer'
import apiClient from '../../../../api/client'

export const Route = createLazyFileRoute('/apps/forms/$formId/analytics')({
	component: FormAnalytics,
})

function FormAnalytics() {
	const { formId } = useParams({ from: '/apps/forms/$formId/analytics' })

	const { data: form, isPending } = useQuery({ queryKey: ['getForm', formId], queryFn: () => apiClient(`/forms/one/${formId}`) })

	if (isPending) return <PageLoader />
	return (
		<PageContainer>
			<div className="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
				<div className="text-center">
					<h3 className="text-lg font-semibold text-gray-800">Form Analytics</h3>
					<p className="text-sm text-gray-500">Form Analytics are coming soon, please be patient</p>
				</div>
			</div>
		</PageContainer>
	)
}
