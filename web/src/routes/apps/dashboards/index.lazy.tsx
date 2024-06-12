import dayjs from 'dayjs'
import { createLazyFileRoute } from '@tanstack/react-router'

import { Dashboard } from '../../../types'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createLazyFileRoute('/apps/dashboards/')({
	component: Dashboards,
})

function Dashboards() {
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
			<Table<Dashboard>
				title="Dashboards"
				columns={tableColumns}
				route="/apps/dashboards/"
				paginateUrl="/dashboards/all"
				queryKeys={['getAllDashboards']}
				defaultEmptyStateName="dashboards"
				addButtonLink="/apps/dashboards/designer"
				description="Create and manage all custom dashboards"
			/>
		</PageContainer>
	)
}
