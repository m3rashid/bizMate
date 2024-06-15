import dayjs from 'dayjs'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useMutation } from '@tanstack/react-query'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { Link, createFileRoute } from '@tanstack/react-router'
import LockOpenIcon from '@heroicons/react/24/outline/LockOpenIcon'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'

import apiClient from '../../../api/client'
import Chip from '../../../components/lib/chip'
import { usePopups } from '../../../hooks/popups'
import Tooltip from '../../../components/lib/tooltip'
import { Form, PageSearchParams } from '../../../types'
import CardList from '../../../components/lib/cardList'
import PageContainer from '../../../components/pageContainer'
import EditForm from '../../../components/apps/forms/editForm'

export const Route = createFileRoute('/apps/forms/')({
	component: Forms,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function FormCard(props: Form & { onEdit: () => void }) {
	const { addMessagePopup } = usePopups()
	const arr = JSON.parse(props.previousVersionIDs)

	const { mutate: deleteForm } = useMutation({
		mutationKey: ['deleteForm', props.id],
		mutationFn: () => apiClient(`/forms/delete/${props.id}`, { method: 'POST' }),
		onError: () => addMessagePopup({ id: props.id, message: 'Failed to delete form', type: 'error' }),
		onSuccess: () => addMessagePopup({ id: props.id, message: 'Form deleted successfully', type: 'success' }),
	})

	return (
		<div className="h-min select-none rounded-lg border-2 border-white p-2 shadow-lg hover:border-primary sm:p-3 md:p-4">
			<div className="flex justify-between gap-2">
				<div>
					<div className="flex flex-grow gap-2">
						<Link
							to="/apps/forms/$formId/preview"
							params={{ formId: props.id.toString() }}
							className={twMerge('font-semibold underline', props.active ? 'text-success' : 'text-danger')}
						>
							{props.title}
						</Link>
						<Tooltip
							show="right"
							label={
								<div className="flex flex-col">
									<div className="flex items-center gap-2">
										<span>{props.active ? 'This form is active' : 'This form is inactive'}</span>
									</div>
									<div className="flex items-center gap-2">
										{props.allowAnonymousResponse ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
										<span>{props.allowAnonymousResponse ? 'Accepting anonymous responses' : 'Not accepting anonymous responses'}</span>
									</div>
									<div className="flex items-center gap-2">
										<ArrowPathIcon className="h-4 w-4" />
										<span>{`${arr.length === 0 ? 'No' : arr.length} previous versions`}</span>
									</div>
								</div>
							}
						>
							<InformationCircleIcon className="h-5 w-5 text-disabled" />
						</Tooltip>
					</div>

					<div>
						<div className="text-xs text-disabled">Created: {dayjs(props.createdAt).format('DD MMM, YYYY - HH:mm A')}</div>
						<div className="text-sm">{props.description}</div>
					</div>
				</div>

				<div className="">
					<Tooltip label="Edit Form" show="right">
						<PencilSquareIcon onClick={props.onEdit} className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight" />
					</Tooltip>
					<Tooltip label="Delete Form" show="right">
						<TrashIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight" onClick={() => deleteForm()} />
					</Tooltip>
				</div>
			</div>

			<div className="mt-4 flex w-full flex-wrap gap-2">
				<Tooltip label="Copy Form URL" show="right">
					<ClipboardIcon
						className="h-7 w-7 cursor-pointer rounded-lg bg-secondary p-1.5 text-white"
						onClick={() => {
							navigator.clipboard.writeText(`${window.location.host}/apps/forms/${props.id}/fill`)
							addMessagePopup({ id: props.id, message: 'Copied Form URL to clipboard', type: 'success' })
						}}
					/>
				</Tooltip>

				<Tooltip label="Show Form preview" show="right">
					<Link to="/apps/forms/$formId/preview" params={{ formId: props.id.toString() }}>
						<Chip>
							<EyeIcon className="h-4 w-4" />
						</Chip>
					</Link>
				</Tooltip>

				<Tooltip label="Show form Responses" show="right">
					<Link to="/apps/forms/$formId/responses" params={{ formId: props.id.toString() }}>
						<Chip>Responses</Chip>
					</Link>
				</Tooltip>

				<Tooltip label="Show form Analytics" show="right">
					<Link to="/apps/forms/$formId/analytics" params={{ formId: props.id.toString() }}>
						<Chip>Analytics</Chip>
					</Link>
				</Tooltip>
			</div>
		</div>
	)
}

function Forms() {
	const [editRow, setEditRow] = useState<Form | undefined>(undefined)

	return (
		<PageContainer>
			<EditForm setOpen={() => setEditRow(undefined)} {...(!!editRow ? { form: editRow, refetch: () => {} } : { form: undefined })} />

			<CardList<Form>
				title="Forms"
				route="/apps/forms/"
				paginateUrl="/forms/all"
				queryKeys={['getForms']}
				defaultEmptyStateName="forms"
				addButtonLink="/apps/forms/designer"
				addButtonProps={{ label: 'New Form' }}
				description="Create and manage all forms"
				tableExportprops={{ tableName: 'forms_table', mutationKeys: [] }}
				cardRenderer={(form) => <FormCard {...{ ...form, onEdit: () => setEditRow(form) }} />}
			/>
		</PageContainer>
	)
}
