import HomePageDashboards from '@components/home'
import PageContainer from '@components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/')({
	component: Index,
})

function Index() {
	const { workspaceId } = useParams({ from: '/$workspaceId/' })
	return (
		<PageContainer workspaceId="">
			<HomePageDashboards workspaceId={workspaceId} />
		</PageContainer>
	)
}
