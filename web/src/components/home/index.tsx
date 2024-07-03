import apiClient from '@api/client'
import ShowDashboard from '@components/dashboardDesigner/showDashboards'
import { PageLoader } from '@components/lib/loader'
import Tabs from '@components/lib/tabs'
import { Dashboard, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

type HomePageDashboardsProps = {
	workspaceId: string
}

function HomePageDashboards(props: HomePageDashboardsProps) {
	const { t } = useTranslation()
	const { data: dashboardPaginationResponse, isPending } = useQuery<PaginationResponse<Dashboard>>({
		queryKey: ['getDashboards', props.workspaceId],
		queryFn: () => apiClient(`/${props.workspaceId}/dashboards/all`),
	})

	if (isPending) return <PageLoader />
	if (!dashboardPaginationResponse || dashboardPaginationResponse.docs.length === 0) return <div>{t('No Dashboards Found')}</div>

	const activeDashboards = dashboardPaginationResponse.docs.filter((t) => t.active)
	if (activeDashboards.length === 0) return <div>{t('No Active Dashboards Found')}</div>

	return (
		<Tabs
			tabs={activeDashboards.map((dashboard) => ({
				id: dashboard.id.toString(),
				label: dashboard.title,
				Component: () => <ShowDashboard dashboardId={dashboard.id} viewType="preview" workspaceId={props.workspaceId} />,
			}))}
		/>
	)
}

export default HomePageDashboards
