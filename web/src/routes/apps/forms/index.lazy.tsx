import dayjs from 'dayjs'
import { useState } from 'react'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { Link, createFileRoute } from '@tanstack/react-router'
import LockOpenIcon from '@heroicons/react/24/outline/LockOpenIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'

import { Form } from '../../../types'
import Chip from '../../../components/lib/chip'
import { usePopups } from '../../../hooks/popups'
import Button from '../../../components/lib/button'
import Tooltip from '../../../components/lib/tooltip'
import PageContainer from '../../../components/pageContainer'
import EditForm from '../../../components/apps/forms/editForm'
import Table, { PageSearchParams, TableProps } from '../../../components/lib/table'

export const Route = createFileRoute('/apps/forms/')({
	component: Forms,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function Forms() {
	const { addMessagePopup } = usePopups()
	const [editRow, setEditRow] = useState<Form | undefined>(undefined)

	const tableColumns: TableProps<Form>['columns'] = [
		{
			dataKey: 'title',
			title: 'Title',
			render: ({ row }) => (
				<Link to="/apps/forms/$formId/preview" params={{ formId: row.id.toString() }} className="underline hover:text-primary">
					{row.title}
				</Link>
			),
		},
		{ dataKey: 'description', title: 'Description' },
		{
			title: 'Created At',
			dataKey: 'createdAt',
			render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
		},
		{
			dataKey: 'active',
			title: 'Indicators',
			render: ({ row }) => {
				const arr = JSON.parse(row.previousVersionIDs)
				return (
					<div className="flex w-fit gap-2">
						<Tooltip label={`${arr.length === 0 ? 'No' : arr.length} previous versions`} show="right">
							<Chip className="flex gap-2" variant={arr.length === 0 ? 'disabled' : 'success'}>
								<ArrowPathIcon className="h-4 w-4" />
							</Chip>
						</Tooltip>

						<Tooltip show="right" label={row.active ? 'This form is accepting responses' : 'This form is not accepting responses'}>
							<Chip variant={row.active ? 'success' : 'danger'}>{row.active ? 'Active' : 'Inactive'}</Chip>
						</Tooltip>

						<Tooltip
							show="right"
							label={row.allowAnonymousResponse ? 'This form accepts anonymous responses' : 'This form does not accept any anonymous response'}
						>
							<Chip variant="secondary">
								{row.allowAnonymousResponse ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
							</Chip>
						</Tooltip>
					</div>
				)
			},
		},
		{
			dataKey: 'id',
			title: 'Actions',
			render: ({ row }) => (
				<div className="flex w-fit items-center gap-2">
					<Tooltip label="Copy Form URL" show="right">
						<ClipboardIcon
							className="h-7 w-7 cursor-pointer rounded-lg bg-secondary p-1.5 text-white"
							onClick={() => {
								navigator.clipboard.writeText(`${window.location.host}/apps/forms/${row.id}/fill`)
								addMessagePopup({ id: row.id, message: 'Copied Form URL to clipboard', type: 'success' })
							}}
						/>
					</Tooltip>

					<Tooltip label="Show Form preview" show="right">
						<Link to="/apps/forms/$formId/preview" params={{ formId: row.id.toString() }}>
							<Chip>
								<EyeIcon className="h-4 w-4" />
							</Chip>
						</Link>
					</Tooltip>

					<Tooltip label="Show form Responses" show="right">
						<Link to="/apps/forms/$formId/responses" params={{ formId: row.id.toString() }}>
							<Chip>Responses</Chip>
						</Link>
					</Tooltip>

					<Tooltip label="Show form Analytics" show="right">
						<Link to="/apps/forms/$formId/analytics" params={{ formId: row.id.toString() }}>
							<Chip>Analytics</Chip>
						</Link>
					</Tooltip>

					<Tooltip label="Edit Form" show="right">
						<Button
							label="Edit"
							size="small"
							variant="secondary"
							onClick={() => setEditRow(row)}
							LeftIcon={<PencilSquareIcon className="h-4 w-4" />}
						/>
					</Tooltip>
				</div>
			),
		},
	]

	return (
		<PageContainer>
			<EditForm setOpen={() => setEditRow(undefined)} {...(!!editRow ? { form: editRow, refetch: () => {} } : { form: undefined })} />

			<Table<Form>
				title="Forms"
				route="/apps/forms/"
				columns={tableColumns}
				paginateUrl="/forms/all"
				queryKeys={['getForms']}
				defaultEmptyStateName="forms"
				addButtonLink="/apps/forms/designer"
				addButtonProps={{ label: 'New Form' }}
				description="Create and manage all forms"
				tableExportprops={{ tableName: 'forms_table', mutationKeys: [] }}
				tableRowClassName={(row) => (row.active ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200')}
			/>
		</PageContainer>
	)
}
