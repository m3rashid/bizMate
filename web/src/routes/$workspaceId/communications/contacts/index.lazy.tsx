import AddEditContactModal from '@components/communications/addEditContactModal'
import BulkUploadContactModal from '@components/communications/bulkUploadContactModal'
import Button from '@components/lib/button'
import Table, { TableProps } from '@components/lib/table'
import Tooltip from '@components/lib/tooltip'
import PageContainer from '@components/pageContainer'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import { Contact, PageSearchParams } from '@mytypes'
import { createFileRoute, useParams } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'

export const Route = createFileRoute('/$workspaceId/communications/contacts/')({
	component: Contacts,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function Contacts() {
	const { workspaceId } = useParams({ from: '/$workspaceId/communications/contacts/' })
	const [open, setOpen] = useState<'addEdit' | 'bulkUpload' | null>(null)
	const [editRow, setEditRow] = useState<Contact | undefined>(undefined)

	const tableColumns: TableProps<Contact>['columns'] = [
		{ title: 'Name', dataKey: 'name' },
		{ title: 'Email', dataKey: 'email' },
		{ title: 'Phone', dataKey: 'phone' },
		{ title: 'Birthday', dataKey: 'birthday', render: ({ row }) => dayjs(row.birthday).format('DD MMM, YYYY') },
		{ title: 'Created At', dataKey: 'created_at', render: ({ row }) => dayjs(row.created_at).format('DD MMM, YYYY - HH:mm A') },
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
		<PageContainer workspaceId={workspaceId}>
			<AddEditContactModal workspaceId={workspaceId} open={open === 'addEdit'} setOpen={() => setOpen(null)} contact={editRow} refetch={() => {}} />
			<BulkUploadContactModal workspaceId={workspaceId} open={open === 'bulkUpload'} setOpen={() => setOpen(null)} refetch={() => {}} />

			<Table<Contact>
				title="Contacts"
				columns={tableColumns}
				workspaceId={workspaceId}
				paginateUrl={`/${workspaceId}/contacts/all`}
				queryKeys={['getContacts']}
				defaultEmptyStateName="contacts"
				description="Create and manage all contacts"
				tableExportprops={{ workspaceId, tableName: 'contacts_table' }}
				addButtonProps={{ label: 'New Contact', onClick: () => setOpen('addEdit') }}
				otherActions={<Button label="Bulk Upload" size="small" variant="secondary" onClick={() => setOpen('bulkUpload')} />}
			/>
		</PageContainer>
	)
}
