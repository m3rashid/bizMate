import FlowDesignerComponent from '../../components/flowDesigner'
import PageContainer from '../../components/pageContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/automations/designer')({
	component: FlowDesigner,
})

function FlowDesigner() {
	return (
		<PageContainer>
			<FlowDesignerComponent />
		</PageContainer>
	)
}
