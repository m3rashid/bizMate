import apiClient from '@api/client'
import ShowDashboard from '@components/dashboardDesigner/showDashboards'
import { PageLoader } from '@components/lib/loader'
import Tabs from '@components/lib/tabs'
import { Dashboard, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'

function HomePageDashboards() {
	const { data: dashboardPaginationResponse, isPending } = useQuery<PaginationResponse<Dashboard>>({
		queryKey: ['getDashboards'],
		queryFn: () => apiClient('/dashboards/all'),
	})

	if (isPending || !dashboardPaginationResponse) return <PageLoader />
	if (dashboardPaginationResponse.docs.length === 0) return <div>No Dashboards Found</div>
	return (
		<Tabs
			tabs={dashboardPaginationResponse.docs
				.filter((t) => t.active)
				.map((dashboard) => ({
					id: dashboard.id.toString(),
					label: dashboard.title,
					Component: () => <ShowDashboard dashboardId={dashboard.id} viewType="preview" />,
				}))}
		/>
	)
}

export default HomePageDashboards
