import dayjs from 'dayjs'
import { useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

import { Project } from '../../../types'
import Button from '../../../components/lib/button'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'
import AddEditProjectModal from '../../../components/projects/addEditProject'

export const Route = createLazyFileRoute('/apps/projects/')({
	component: Projects,
})

function Projects() {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [editRow, setEditRow] = useState<Project | undefined>(undefined)

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
			title: '',
			render: ({ row }) => (
				<div className="flex w-fit items-center gap-2">
					<Button variant="simple" label="Readme" size="small" onClick={() => navigate({ to: `/apps/projects/${row.id}/readme` })} />
					<Button variant="simple" label="Guidelines" size="small" onClick={() => navigate({ to: `/apps/projects/${row.id}/guidelines` })} />
					<Button variant="simple" label="Documentation" size="small" onClick={() => navigate({ to: `/apps/projects/${row.id}/docs` })} />
				</div>
			),
		},
		{
			dataKey: 'id',
			title: 'Actions',
			render: ({ row }) => (
				<div className="flex w-fit items-center gap-2">
					<Button label="Details" size="small" onClick={() => navigate({ to: `/apps/projects/${row.id}` })} />
					<Button
						label="Edit"
						size="small"
						variant="secondary"
						onClick={() => {
							setEditRow(row)
							setOpen(true)
						}}
						LeftIcon={<PencilSquareIcon className="h-4 w-4" />}
					/>
				</div>
			),
		},
	]

	return (
		<PageContainer>
			<AddEditProjectModal {...{ open, setOpen, refetch: () => {}, project: editRow }} />

			<Table<Project>
				title="Projects"
				columns={tableColumns}
				queryKeys={['getProjects']}
				paginateUrl="/projects/all"
				addButtonProps={{
					label: 'New Project',
					onClick: () => setOpen(true),
				}}
				defaultEmptyStateName="projects"
				addButtonLink="/apps/projects/create"
				description="Create and manage all projects"
			/>
		</PageContainer>
	)
}
