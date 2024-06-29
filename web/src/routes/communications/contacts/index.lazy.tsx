import AddEditContactModal from '../../../components/communications/addEditContactModal'
import BulkUploadContactModal from '../../../components/communications/bulkUploadContactModal'
import Button from '../../../components/lib/button'
import Table, { TableProps } from '../../../components/lib/table'
import Tooltip from '../../../components/lib/tooltip'
import PageContainer from '../../../components/pageContainer'
import { Contact, PageSearchParams } from '../../../types'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'

export const Route = createFileRoute('/communications/contacts/')({
	component: Contacts,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function Contacts() {
	const [open, setOpen] = useState<'addEdit' | 'bulkUpload' | null>(null)
	const [editRow, setEditRow] = useState<Contact | undefined>(undefined)

	const tableColumns: TableProps<Contact>['columns'] = [
		{ title: 'Name', dataKey: 'name' },
		{ title: 'Email', dataKey: 'email' },
		{ title: 'Phone', dataKey: 'phone' },
		{ title: 'Birthday', dataKey: 'birthday', render: ({ row }) => dayjs(row.birthday).format('DD MMM, YYYY') },
		{ title: 'Created At', dataKey: 'createdAt', render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A') },
		{
			dataKey: 'id',
			title: 'Actions',
			render: ({ row }) => (
				<div className="flex w-fit items-center gap-2">
					<Tooltip label="Edit Form" position="right">
						<Button
							label="Edit"
							size="small"
							variant="secondary"
							onClick={() => {
								setEditRow(row)
								setOpen('addEdit')
							}}
							LeftIcon={<PencilSquareIcon className="h-4 w-4" />}
						/>
					</Tooltip>
				</div>
			),
		},
	]

	return (
		<PageContainer>
			<AddEditContactModal open={open === 'addEdit'} setOpen={() => setOpen(null)} contact={editRow} refetch={() => {}} />
			<BulkUploadContactModal open={open === 'bulkUpload'} setOpen={() => setOpen(null)} refetch={() => {}} />

			<Table<Contact>
				title="Contacts"
				columns={tableColumns}
				paginateUrl="/contacts/all"
				queryKeys={['getContacts']}
				defaultEmptyStateName="contacts"
				description="Create and manage all contacts"
				addButtonProps={{ label: 'New Contact', onClick: () => setOpen('addEdit') }}
				otherActions={<Button label="Bulk Upload" size="small" variant="secondary" onClick={() => setOpen('bulkUpload')} />}
			/>
		</PageContainer>
	)
}
