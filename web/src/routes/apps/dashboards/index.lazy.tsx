import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { PlusIcon } from '@heroicons/react/24/outline'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import { Dashboard } from '../../../types'
import apiClient from '../../../api/client'
import Button from '../../../components/lib/button'
import { PageLoader } from '../../../components/lib/loader'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createLazyFileRoute('/apps/dashboards/')({
	component: Dashboards,
})

function Dashboards() {
	const navigate = useNavigate({ from: '/apps/dashboards' })
	const { data, isPending, refetch } = useQuery({ queryKey: ['getAllDashboards'], queryFn: () => apiClient('/dashboards/all') })

	const tableColumns: TableProps<Dashboard>['columns'] = [
		{ dataKey: 'title', title: 'Title' },
		{ dataKey: 'description', title: 'Description' },
		{
			title: 'Created At',
			dataKey: 'createdAt',
			render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
		},
	]

	const AddButton = (
		<Button label="New Dashboard" LeftIcon={<PlusIcon className="h-5 w-5" />} onClick={() => navigate({ to: '/apps/dashboards/designer' })} />
	)

	return (
		<PageContainer>
			{' '}
			{isPending ? (
				<PageLoader />
			) : (
				<Table<Dashboard>
					title="Forms"
					description="Create and manage all forms"
					data={data?.docs || []}
					columns={tableColumns}
					addButton={AddButton}
					emptyState={
						<div className="flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
							<div className="text-center">
								<h3 className="text-lg font-semibold text-gray-800">No dashboards found</h3>
								<p className="text-sm text-gray-500">Get started by creating a new dashboard</p>
							</div>
							{AddButton}
						</div>
					}
				/>
			)}
		</PageContainer>
	)
}
