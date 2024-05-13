import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '../../../components/pageContainer'
import FlowDesignerComponent from '../../../components/flowDesigner'

export const Route = createFileRoute('/apps/flows/')({
	component: FlowDesigner,
})

function FlowDesigner() {
	return (
		<PageContainer>
			<FlowDesignerComponent />
		</PageContainer>
	)
}
