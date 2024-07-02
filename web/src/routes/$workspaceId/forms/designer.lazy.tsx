import FormDesignerComponent from '@components/formDesigner'
import PageContainer from '@components/pageContainer'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/forms/designer')({
	component: FormDesigner,
})

function FormDesigner() {
	const { workspaceId } = useParams({ from: '/$workspaceId/forms/designer' })
	return (
		<PageContainer workspaceId={workspaceId} bodyClassName="p-0 sm:p-0">
			<FormDesignerComponent workspaceId={workspaceId} />
		</PageContainer>
	)
}
