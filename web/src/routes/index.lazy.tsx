import { createLazyFileRoute } from '@tanstack/react-router'

import AppsList from '../components/apps'
import PageContainer from '../components/pageContainer'

export const Route = createLazyFileRoute('/')({ component: Index })

function Index() {
	return (
		<PageContainer>
			<AppsList />
		</PageContainer>
	)
}
