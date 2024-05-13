import { createFileRoute } from '@tanstack/react-router'
import PageContainer from '../../../components/pageContainer'
import FlowBuilder from '../../../components/flowBuilder'

export const Route = createFileRoute('/apps/flows/')({
	component: Flows,
})

function Flows() {
	return (
		<PageContainer>
			<FlowBuilder />
		</PageContainer>
	)
}
