import apiClient from '@api/client'
import AddEditForm from '@components/formDesigner/editForm'
import Button from '@components/lib/button'
import CardList from '@components/lib/cardList'
import Chip from '@components/lib/chip'
import Tooltip from '@components/lib/tooltip'
import PageContainer from '@components/pageContainer'
import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon'
import LockOpenIcon from '@heroicons/react/24/outline/LockOpenIcon'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { usePopups } from '@hooks/popups'
import { Form, PageSearchParams } from '@mytypes'
import { useMutation } from '@tanstack/react-query'
import { Link, createFileRoute, useParams } from '@tanstack/react-router'
import { handleViewTransition } from '@utils/helpers'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

export const Route = createFileRoute('/$workspaceId/forms/')({
	component: Forms,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function FormCard(props: Form & { onEdit: () => void; workspaceId: string }) {
	const { t } = useTranslation()
	const [showActions, setShowActions] = useState(false)
	const { addMessagePopup, addActionPopup, removeActionPopup } = usePopups()

	const { mutate: deleteForm } = useMutation({
		mutationKey: ['deleteForm', props.id],
		mutationFn: () => apiClient(`/${props.workspaceId}/forms/delete/${props.id}`, { method: 'POST' }),
		onError: () => addMessagePopup({ id: props.id, message: 'Failed to delete form', type: 'error' }),
		onSuccess: () => addMessagePopup({ id: props.id, message: 'Form deleted successfully', type: 'success' }),
	})

	function onDeleteConfirm() {
		deleteForm()
		removeActionPopup('sureToDeleteForm')
	}

	function handleDeleteForm() {
		addActionPopup({
			type: 'warning',
			id: 'sureToDeleteForm',
			title: 'Are you sure ?',
			children: (
				<>
					<h3 className="text-sm text-disabled">{t('delete_warning')}</h3>
					<div className="mt-2 flex items-center justify-between">
						<Button size="small" variant="simple" onClick={() => removeActionPopup('sureToDeleteForm')} className="py-1">
							{t('Cancel')}
						</Button>
						<Button size="small" variant="danger" onClick={onDeleteConfirm} className="py-1">
							{t('Delete')}
						</Button>
					</div>
				</>
			),
		})
	}

	return (
		<div
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
			className="relative h-min select-none rounded-lg border-2 border-white p-2.5 shadow-lg hover:border-primary"
		>
			<div className="flex flex-grow gap-2">
				<Link
					to="/$workspaceId/forms/$formId/preview"
					params={{ formId: props.id, workspaceId: props.workspaceId }}
					className={twMerge('font-semibold underline', props.active ? 'text-success' : 'text-danger')}
				>
					{props.title}
				</Link>
				<Tooltip
					position="right"
					label={
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<span>{props.active ? 'This form is active' : 'This form is inactive'}</span>
							</div>
							<div className="flex items-center gap-2">
								{props.allow_anonymous_response ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
								<span>{props.allow_anonymous_response ? t('Accepting anonymous responses') : t('Not accepting anonymous responses')}</span>
							</div>
						</div>
					}
				>
					<InformationCircleIcon className="h-5 w-5 text-disabled" />
				</Tooltip>
			</div>

			<div className="mb-2 text-xs text-disabled">
				{t('Created')}: {dayjs(props.created_at).format('DD MMM, YYYY - HH:mm A')}
			</div>
			{props.description ? <div className="text-sm">{props.description}</div> : null}

			{showActions ? (
				<div className="absolute right-1 top-1">
					<Tooltip label="Edit Form" position="left">
						<PencilSquareIcon onClick={props.onEdit} className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-primaryLight" />
					</Tooltip>
					<Tooltip label="Delete Form" position="left">
						<TrashIcon className="h-8 w-8 rounded-md p-1.5 text-disabled hover:bg-dangerLight" onClick={handleDeleteForm} />
					</Tooltip>
				</div>
			) : null}

			<div className="mt-4 flex w-full flex-wrap gap-2">
				<Tooltip label="Copy Form URL" position="right">
					<ClipboardIcon
						className="h-7 w-7 cursor-pointer rounded-lg bg-secondary p-1.5 text-white"
						onClick={() => {
							navigator.clipboard.writeText(`${window.location.host}/${props.workspaceId}/forms/${props.id}/fill`)
							addMessagePopup({ id: props.id, message: 'Copied Form URL to clipboard', type: 'success' })
						}}
					/>
				</Tooltip>

				<Tooltip label="Show Form preview" position="right">
					<Link to="/$workspaceId/forms/$formId/preview" params={{ formId: props.id, workspaceId: props.workspaceId }}>
						<Chip>
							<EyeIcon className="h-4 w-4" />
						</Chip>
					</Link>
				</Tooltip>

				<Tooltip label="Show form Responses" position="right">
					<Link to="/$workspaceId/forms/$formId/responses" params={{ formId: props.id, workspaceId: props.workspaceId }}>
						<Chip>Responses</Chip>
					</Link>
				</Tooltip>

				<Tooltip label="Show form Analytics" position="right">
					<Link to="/$workspaceId/forms/$formId/analytics" params={{ formId: props.id, workspaceId: props.workspaceId }}>
						<Chip>Analytics</Chip>
					</Link>
				</Tooltip>
			</div>
		</div>
	)
}

function Forms() {
	const [open, setOpen] = useState(false)
	const { workspaceId } = useParams({ from: '/$workspaceId/forms/' })
	const [editRow, setEditRow] = useState<Form | undefined>(undefined)

	return (
		<PageContainer workspaceId={workspaceId}>
			<AddEditForm
				open={open}
				refetch={() => {}}
				workspaceId={workspaceId}
				form={!!editRow ? editRow : undefined}
				onClose={() =>
					handleViewTransition(() => {
						setOpen(false)
						setEditRow(undefined)
					})
				}
			/>

			<CardList<Form>
				title="Forms"
				paginateUrl={`/${workspaceId}/forms/all`}
				queryKeys={['getForms']}
				workspaceId={workspaceId}
				defaultEmptyStateName="forms"
				otherActions={
					<Button size="small" onClick={() => setOpen(true)} LeftIcon={<PlusIcon className="h-4 w-4" />}>
						New Form
					</Button>
				}
				description="Create and manage all forms"
				tableExportprops={{ tableName: 'forms_table', mutationKeys: [], workspaceId }}
				cardRenderer={(form) => (
					<FormCard
						workspaceId={workspaceId}
						{...{
							...form,
							onEdit: () => {
								setEditRow(form)
								setOpen(true)
							},
						}}
					/>
				)}
			/>
		</PageContainer>
	)
}
