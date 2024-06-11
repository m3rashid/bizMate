import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

import apiClient from '../../../../api/client'
import { PageLoader } from '../../../../components/lib/loader'
import PageContainer from '../../../../components/pageContainer'
import FormView from '../../../../components/apps/forms/formView'

export const Route = createFileRoute('/apps/forms/$formId/preview')({
	component: FormPreview,
})

function FormPreview() {
	const { formId } = useParams({ from: '/apps/forms/$formId/preview' })

	const { data: form, isPending } = useQuery({ queryKey: ['getForm', formId], queryFn: () => apiClient(`/forms/one/${formId}`) })

	if (isPending) return <PageLoader />
	return (
		<PageContainer bodyClassName="flex flex-col items-center">
			<FormView type="preview" form={form} />
		</PageContainer>
	)
}
