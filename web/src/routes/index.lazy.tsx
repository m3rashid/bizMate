import AppsList from '../components/apps'
import PageContainer from '../components/pageContainer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({ component: Index })

function Index() {
	return (
		<PageContainer>
			<AppsList />
		</PageContainer>
	)
}
