import apiClient from '@api/client'
import FormView from '@components/apps/forms/formView'
import { PageLoader } from '@components/lib/loader'
import PageContainer from '@components/pageContainer'
import { ApiResponse, Form, FormBodyDocument } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/forms/$formId/preview')({
	component: FormPreview,
})

function FormPreview() {
	const { formId, workspaceId } = useParams({ from: '/$workspaceId/forms/$formId/preview' })

	const { data: res, isPending } = useQuery<ApiResponse<{ form: Form; formBody?: FormBodyDocument }>>({
		queryKey: ['getForm', formId, workspaceId],
		queryFn: () => apiClient(`/${workspaceId}/forms/one/${formId}`),
	})

	if (isPending || !res) return <PageLoader />
	console.log(res)
	return (
		<PageContainer workspaceId={workspaceId} bodyClassName="flex flex-col items-center">
			<FormView type="preview" form={res.data.form} formBody={res.data.formBody} />
		</PageContainer>
	)
}
