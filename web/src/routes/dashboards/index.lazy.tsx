import Table, { TableProps } from '../../components/lib/table'
import PageContainer from '../../components/pageContainer'
import { Dashboard } from '../../types'
import { createLazyFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const Route = createLazyFileRoute('/dashboards/')({
	component: Dashboards,
})

function Dashboards() {
	const tableColumns: TableProps<Dashboard>['columns'] = [
		{ dataKey: 'title', title: 'Title' },
		{ dataKey: 'description', title: 'Description' },
		{ title: 'Created At', dataKey: 'createdAt', render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A') },
	]

	return (
		<PageContainer>
			<Table<Dashboard>
				title="Dashboards"
				columns={tableColumns}
				paginateUrl="/dashboards/all"
				queryKeys={['getAllDashboards']}
				defaultEmptyStateName="dashboards"
				description="Create and manage all custom dashboards"
			/>
		</PageContainer>
	)
}
