import PageContainer from '../../../components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/$dashboardId/')({
	component: PreviewDashboard,
})

function PreviewDashboard() {
	const { dashboardId } = useParams({ from: '/dashboards/$dashboardId/' })

	return (
		<PageContainer>
			<div>Hello /dashboards/$dashboardId/!</div>
		</PageContainer>
	)
}
