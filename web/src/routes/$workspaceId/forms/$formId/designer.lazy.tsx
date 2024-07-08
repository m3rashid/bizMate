import FormDesignerComponent from '@components/formDesigner'
import PageContainer from '@components/pageContainer'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/forms/$formId/designer')({
	component: FormDesigner,
})

function FormDesigner() {
	const { workspaceId, formId } = useParams({ from: '/$workspaceId/forms/$formId/designer' })
	return (
		<PageContainer workspaceId={workspaceId} bodyClassName="p-0 sm:p-0">
			<FormDesignerComponent workspaceId={workspaceId} formId={formId} />
		</PageContainer>
	)
}
