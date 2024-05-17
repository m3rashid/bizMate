import { createLazyFileRoute } from '@tanstack/react-router'

import PageContainer from '../../../components/pageContainer'

export const Route = createLazyFileRoute('/apps/flows/')({
	component: Flows,
})

function Flows() {
	return (
		<PageContainer>
			<h1>All Flows</h1>
		</PageContainer>
	)
}
