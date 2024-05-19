import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

import { Dashboard } from '../../../types'
import apiClient from '../../../api/client'
import { PageLoader } from '../../../components/lib/loader'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createLazyFileRoute('/apps/dashboards/')({
	component: Dashboards,
})

function Dashboards() {
	const { data, isPending } = useQuery({ queryKey: ['getAllDashboards'], queryFn: () => apiClient('/dashboards/all') })

	const tableColumns: TableProps<Dashboard>['columns'] = [
		{ dataKey: 'title', title: 'Title' },
		{ dataKey: 'description', title: 'Description' },
		{
			title: 'Created At',
			dataKey: 'createdAt',
			render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
		},
	]

	return (
		<PageContainer>
			{isPending ? (
				<PageLoader />
			) : (
				<Table<Dashboard>
					title="Dashboards"
					description="Create and manage all custom dashboards"
					data={data?.docs || []}
					columns={tableColumns}
					defaultEmptyStateName="dashboards"
					addButtonLink="/apps/dashboards/designer"
				/>
			)}
		</PageContainer>
	)
}
