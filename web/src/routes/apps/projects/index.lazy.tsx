import dayjs from 'dayjs'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import { Project } from '../../../types'
import apiClient from '../../../api/client'
import Button from '../../../components/lib/button'
import { PageLoader } from '../../../components/lib/loader'
import PageContainer from '../../../components/pageContainer'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Table, { TableProps } from '../../../components/lib/table'
import AddEditProjectModal from '../../../components/projects/addEditModalForm'

export const Route = createLazyFileRoute('/apps/projects/')({
	component: Projects,
})

function Projects() {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [editRow, setEditRow] = useState<Project | undefined>(undefined)
	const { data, isPending, refetch } = useQuery({ queryKey: ['getProjects'], queryFn: () => apiClient('/projects/all') })

	const tableColumns: TableProps<Project>['columns'] = [
		{ dataKey: 'name', title: 'Title' },
		{ dataKey: 'description', title: 'Description' },
		{
			title: 'Created At',
			dataKey: 'createdAt',
			render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
		},
		{
			dataKey: 'id',
			title: 'Actions',
			render: ({ row }) => (
				<div className="flex w-fit items-center gap-2">
					<Button label="Details" size="small" onClick={() => navigate({ to: `/apps/projects/${row.id}/details` })} />
					<Button label="Edit" size="small" variant="secondary" onClick={() => setEditRow(row)} LeftIcon={<PencilSquareIcon className="h-4 w-4" />} />
				</div>
			),
		},
	]

	return (
		<PageContainer>
			<AddEditProjectModal {...{ open, setOpen, refetch, project: editRow }} />

			{isPending ? (
				<PageLoader />
			) : (
				<Table<Project>
					title="Projects"
					description="Create and manage all projects"
					data={data?.docs || []}
					columns={tableColumns}
					defaultEmptyStateName="projects"
					addButtonLink="/apps/projects/create"
					addButtonProps={{
						label: 'New Project',
						onClick: () => {},
					}}
				/>
			)}
		</PageContainer>
	)
}
