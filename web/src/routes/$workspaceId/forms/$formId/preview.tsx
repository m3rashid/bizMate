import apiClient from '@api/client'
import FormView from '@components/apps/forms/formView'
import { PageLoader } from '@components/lib/loader'
import PageContainer from '@components/pageContainer'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/forms/$formId/preview')({
	component: FormPreview,
})

function FormPreview() {
	const { formId } = useParams({ from: '/$workspaceId/forms/$formId/preview' })

	const { data: form, isPending } = useQuery({ queryKey: ['getForm', formId], queryFn: () => apiClient(`/forms/one/${formId}`) })

	if (isPending) return <PageLoader />
	return (
		<PageContainer bodyClassName="flex flex-col items-center">
			<FormView type="preview" form={form} />
		</PageContainer>
	)
}
