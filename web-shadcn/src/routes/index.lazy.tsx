import { AppList } from '@/components/modules/core/appList'
import { PageContainer } from '@/components/modules/core/pageContainer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({ component: Index })

function Index() {
	return (
		<PageContainer>
			<AppList />
		</PageContainer>
	)
}
