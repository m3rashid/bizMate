import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlusIcon, LockOpenIcon, ArrowPathIcon, ClipboardIcon, LockClosedIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

import { Form } from '../../../types'
import apiClient from '../../../api/client'
import Chip from '../../../components/lib/chip'
import Button from '../../../components/lib/button'
import Tooltip from '../../../components/lib/tooltip'
import { PageLoader } from '../../../components/lib/loader'
import PageContainer from '../../../components/pageContainer'
import EditForm from '../../../components/apps/forms/editForm'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createFileRoute('/apps/forms/')({
	component: Forms,
})

function Forms() {
	const navigate = useNavigate()
	const [editRow, setEditRow] = useState<Form | undefined>(undefined)
	const { data, isPending, refetch } = useQuery({ queryKey: ['getForms'], queryFn: () => apiClient('/forms/all') })

	const tableColumns: TableProps<Form>['columns'] = [
		{ dataKey: 'title', title: 'Title' },
		{ dataKey: 'description', title: 'Description' },
		{
			title: 'Created At',
			dataKey: 'createdAt',
			render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
		},
		{
			dataKey: 'active',
			title: '',
			render: ({ row }) => {
				const arr = JSON.parse(row.previousVersionIDs)
				return (
					<div className="flex w-fit gap-2">
						<Chip className="flex gap-2" variant="disabled">
							<ArrowPathIcon className="h-4 w-4" />
							<span className="">{`${arr.length === 0 ? 'No' : arr.length} previous versions`}</span>
						</Chip>

						<Chip variant={row.active ? 'success' : 'danger'}>{row.active ? 'Active' : 'Inactive'}</Chip>
						<Chip variant="secondary">
							{row.allowAnonymousResponse ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
						</Chip>
					</div>
				)
			},
		},
		{
			dataKey: 'id',
			title: 'Actions',
			render: ({ row }) => (
				<div className="flex w-fit items-center gap-2">
					<Tooltip label="Copy Form URL">
						<ClipboardIcon
							className="h-8 w-8 cursor-pointer rounded-lg bg-secondary p-1.5 text-white"
							onClick={() => navigator.clipboard.writeText(`${window.location.host}/apps/forms/${row.id}/fill`)}
						/>
					</Tooltip>
					<Button label="Details" size="small" onClick={() => navigate({ to: `/apps/forms/${row.id}/details` })} />
					<Button label="Edit" size="small" variant="secondary" onClick={() => setEditRow(row)} LeftIcon={<PencilSquareIcon className="h-4 w-4" />} />
				</div>
			),
		},
	]

	return (
		<PageContainer>
			<EditForm setOpen={() => setEditRow(undefined)} {...(!!editRow ? { form: editRow, refetch } : { form: undefined })} />

			{isPending ? (
				<PageLoader />
			) : (
				<Table<Form>
					title="Forms"
					description="Create and manage all forms"
					data={data?.docs || []}
					columns={tableColumns}
					addButtonLink="/apps/forms/designer"
					defaultEmptyStateName="forms"
				/>
			)}
		</PageContainer>
	)
}
