import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowPathIcon, LockClosedIcon, LockOpenIcon, PlusIcon } from '@heroicons/react/24/outline'

import { Form } from '../../../types'
import apiClient from '../../../api/client'
import Chip from '../../../components/lib/chip'
import Loader from '../../../components/lib/loader'
import Button from '../../../components/lib/button'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createFileRoute('/apps/forms/')({
	component: Forms,
})

function Forms() {
	const navigate = useNavigate()
	const { data, isPending } = useQuery({
		queryKey: ['getForms'],
		queryFn: () => apiClient('/forms/all', { method: 'GET' }),
	})

	const tableColumns: TableProps<Form>['columns'] = [
		{ dataKey: 'title', title: 'Title' },
		{ dataKey: 'description', title: 'Description' },
		{ dataKey: 'createdAt', title: 'Created At' },
		{ dataKey: 'submitText', title: 'Submit Text' },
		{ dataKey: 'cancelText', title: 'Cancel Text' },
		{
			dataKey: 'active',
			title: '',
			render: ({ row }) => {
				const arr = JSON.parse(row.previousVersionIDs)
				return (
					<div className="flex flex-wrap gap-4">
						<Chip className="flex gap-2" variant="disabled">
							<ArrowPathIcon className="h-4 w-4" />
							<span className="">{`${arr.length === 0 ? 'No' : arr.length} previous versions`}</span>
						</Chip>

						<Chip variant={row.active ? 'success' : 'danger'}>
							{row.active ? 'Active' : 'Inactive'}
						</Chip>
						<Chip>
							{row.authRequired ? (
								<LockClosedIcon className="h-4 w-4" />
							) : (
								<LockOpenIcon className="h-4 w-4" />
							)}
						</Chip>
					</div>
				)
			},
		},
	]

	return (
		<PageContainer>
			{isPending ? (
				<Loader className="h-24 w-24" />
			) : (
				<Table<Form>
					title="Forms"
					data={data.docs}
					columns={tableColumns}
					emptyState={
						<div className="flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
							<div className="text-center">
								<h3 className="text-lg font-semibold text-gray-800">No Forms found</h3>
								<p className="text-sm text-gray-500">Get started by creating a new project.</p>
							</div>

							<Button
								label="New Form"
								leftIcon={PlusIcon}
								onClick={() => navigate({ to: '/apps/forms/designer' })}
							/>
						</div>
					}
				/>
			)}
		</PageContainer>
	)
}
