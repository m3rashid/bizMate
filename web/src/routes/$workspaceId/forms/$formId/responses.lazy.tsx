import apiClient from '@api/client'
import FormResponsesTable from '@components/apps/forms/formResponse'
import { PageLoader } from '@components/lib/loader'
import { NotFound } from '@components/lib/notFound'
import PageContainer from '@components/pageContainer'
import { Form } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/forms/$formId/responses')({
	component: FormResponses,
})

function FormResponses() {
	const { workspaceId } = useParams({ from: '/$workspaceId/forms/$formId/responses' })
	const { formId } = useParams({ from: '/$workspaceId/forms/$formId/responses' })

	const { data: form, isPending: isFormFetchPending } = useQuery<Form>({
		queryKey: ['getForm', formId, workspaceId],
		queryFn: () => apiClient(`/${workspaceId}/forms/one/${formId}`),
	})

	if (isFormFetchPending) return <PageLoader />
	if (!form) return <NotFound />

	return (
		<PageContainer workspaceId={workspaceId}>
			<FormResponsesTable {...form} workspaceId={workspaceId} />
		</PageContainer>
	)
}
