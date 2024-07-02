import apiClient from '@api/client'
import ShowDashboard from '@components/dashboardDesigner/showDashboards'
import { PageLoader } from '@components/lib/loader'
import Tabs from '@components/lib/tabs'
import { Dashboard, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'

type HomePageDashboardsProps = {
	workspaceId: string
}

function HomePageDashboards(props: HomePageDashboardsProps) {
	const { data: dashboardPaginationResponse, isPending } = useQuery<PaginationResponse<Dashboard>>({
		queryKey: ['getDashboards', props.workspaceId],
		queryFn: () => apiClient(`/${props.workspaceId}/dashboards/all`),
	})

	if (isPending) return <PageLoader />
	if (!dashboardPaginationResponse || dashboardPaginationResponse.docs.length === 0) return <div>No Dashboards Found</div>
	return (
		<Tabs
			tabs={dashboardPaginationResponse.docs
				.filter((t) => t.active)
				.map((dashboard) => ({
					id: dashboard.id.toString(),
					label: dashboard.title,
					Component: () => <ShowDashboard dashboardId={dashboard.id} viewType="preview" workspaceId={props.workspaceId} />,
				}))}
		/>
	)
}

export default HomePageDashboards
