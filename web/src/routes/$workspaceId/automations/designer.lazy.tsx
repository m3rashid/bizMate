import FlowDesignerComponent from '@components/flowDesigner'
import PageContainer from '@components/pageContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/automations/designer')({
	component: FlowDesigner,
})

function FlowDesigner() {
	return (
		<PageContainer>
			<FlowDesignerComponent />
		</PageContainer>
	)
}
