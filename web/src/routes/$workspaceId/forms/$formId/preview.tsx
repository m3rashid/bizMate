import apiClient from '@api/client'
import SingleFormView from '@components/formDesigner/singleFormView'
import Button from '@components/lib/button'
import { PageLoader } from '@components/lib/loader'
import Tabs from '@components/lib/tabs'
import PageContainer from '@components/pageContainer'
import { ApiResponse, Form } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/forms/$formId/preview')({
	component: FormPreview,
})

function FormPreview() {
	const navigate = useNavigate({ from: '/$workspaceId/forms/$formId/preview' })
	const { formId, workspaceId } = useParams({ from: '/$workspaceId/forms/$formId/preview' })

	const { data: res, isPending } = useQuery<ApiResponse<Form>>({
		queryKey: ['getForm', formId, workspaceId],
		queryFn: () => apiClient(`/${workspaceId}/forms/one/${formId}`),
	})

	if (isPending || !res) return <PageLoader />
	return (
		<PageContainer workspaceId={workspaceId} bodyClassName="flex items-start flex-col md:flex-row gap-4">
			<Tabs
				rootClassName="md:flex-grow w-full"
				tabClassName="shadow-lg p-3.5 rounded-3xl border-2 border-white hover:border-primary"
				tabs={(res.data.form_body || []).map((formInnerBody, index) => ({
					Component: SingleFormView,
					id: index.toString(),
					label: `Form Page ${index + 1}`,
					componentProps: {
						type: 'preview',
						form: res.data,
						singleFormInnerBody: formInnerBody,
					},
				}))}
			/>

			<div className="flex w-full items-center justify-center md:max-w-56">
				<Button
					size="small"
					onClick={() =>
						navigate({
							to: '/$workspaceId/forms/$formId/designer',
							params: { formId: res.data.id || '', workspaceId: res.data.workspace_id || '' },
						})
					}
				>
					{res.data.form_body && res.data.form_body.length > 0 ? 'Add More form Pages' : 'Add form pages'}
				</Button>
			</div>
		</PageContainer>
	)
}
