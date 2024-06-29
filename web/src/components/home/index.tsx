import apiClient from '../../api/client'
import { Dashboard, PaginationResponse } from '../../types'
import ShowDashboard from '../dashboardDesigner/showDashboards'
import { PageLoader } from '../lib/loader'
import Tabs from '../lib/tabs'
import { useQuery } from '@tanstack/react-query'

function HomePageDashboards() {
	const { data: dashboardPaginationResponse, isPending } = useQuery<PaginationResponse<Dashboard>>({
		queryKey: ['getDashboards'],
		queryFn: () => apiClient('/dashboards/all'),
	})

	if (isPending || !dashboardPaginationResponse) return <PageLoader />
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
