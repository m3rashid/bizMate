import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

import apiClient from '../../../../api/client'
import { PageLoader } from '../../../../components/lib/loader'
import PageContainer from '../../../../components/pageContainer'
import { PageNotFound } from '../../../../components/lib/notFound'
import FormView from '../../../../components/formDesigner/formView'

export const Route = createFileRoute('/apps/forms/$formId/preview')({
	component: FormPreview,
})

function FormPreview() {
	const { formId } = useParams({ from: '/apps/forms/$formId/preview' })

	const { data, isPending } = useQuery({
		queryKey: ['getForm', formId],
		queryFn: () => apiClient(`/forms/one/${formId}`, { method: 'GET' }),
	})

	if (!formId || isNaN(parseInt(formId))) return <PageNotFound />
	if (isPending) return <PageLoader />

	return (
		<PageContainer bodyClassName="flex justify-center">
			<FormView type="preview" form={data} />
		</PageContainer>
	)
}
