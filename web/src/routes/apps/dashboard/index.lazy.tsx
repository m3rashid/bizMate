import { createLazyFileRoute } from '@tanstack/react-router'
import PageContainer from '../../../components/pageContainer'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../api/client'

export const Route = createLazyFileRoute('/apps/dashboard/')({
	component: Dashboard,
})

function Dashboard() {
	const {} = useQuery({ queryKey: ['getAllDashboards'], queryFn: () => apiClient('/dashboards/all') })

	return <PageContainer></PageContainer>
}
