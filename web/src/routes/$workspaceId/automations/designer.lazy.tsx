import FlowDesignerComponent from '@components/flowDesigner'
import PageContainer from '@components/pageContainer'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/automations/designer')({
	component: FlowDesigner,
})

function FlowDesigner() {
	const { workspaceId } = useParams({ from: '/$workspaceId/automations/designer' })
	return (
		<PageContainer workspaceId={workspaceId}>
			<FlowDesignerComponent />
		</PageContainer>
	)
}
