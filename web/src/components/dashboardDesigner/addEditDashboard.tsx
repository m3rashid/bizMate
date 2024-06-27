import apiClient from '../../api/client'
import { usePopups } from '../../hooks/popups'
import { Dashboard } from '../../types'
import { handleViewTransition } from '../../utils/helpers'
import Button from '../lib/button'
import Input from '../lib/input'
import Modal from '../lib/modal'
import TextAreaInput from '../lib/textAreaInput'
import TogglerInput from '../lib/toggle'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, FormEvent, SetStateAction } from 'react'

type AddEditDashboardProps = { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> } & (
	| { dashboard: undefined }
	| { dashboard: Dashboard; refetch: () => void }
)

function AddEditDashboard(props: AddEditDashboardProps) {
	const { addMessagePopup } = usePopups()

	const { mutate: createDashboard } = useMutation({
		mutationKey: ['createDashboard'],
		mutationFn: (dashboard: Partial<Dashboard>) => apiClient('/dashboards/create', { method: 'POST', body: JSON.stringify(dashboard) }),
		onSuccess: () => {
			props.setOpen(false)
			addMessagePopup({ id: 'createDashboardSuccess', type: 'success', message: 'Dashboard created Successfully' })
			if (props.dashboard) props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'createDashboardError', type: 'error', message: 'Error in creating dashboard' })
		},
	})

	const { mutate: updateDashboard } = useMutation({
		mutationKey: ['updateDashboard'],
		mutationFn: (dashboard: Partial<Dashboard>) =>
			apiClient(`/dashboards/update/${props.dashboard?.id}`, { method: 'POST', body: JSON.stringify(dashboard) }),
		onSuccess: () => {
			props.setOpen(false)
			addMessagePopup({ id: 'updateDashboardSuccess', type: 'success', message: 'Dashboard updated Successfully' })
			if (props.dashboard) props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'updateDashboardError', type: 'error', message: 'Error in updating dashboard' })
		},
	})

	function handleAddEditDashboard(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.title) {
			addMessagePopup({ id: 'noTitleDashboard', message: 'Dashboard title is required', type: 'error' })
			return
		}

		if (!!props.dashboard) {
			updateDashboard({ title: formData.title, description: formData.description || props.dashboard.description, active: formData.active === 'on' })
		} else {
			createDashboard({ title: formData.title, description: formData.description || '' })
		}
	}

	return (
		<Modal
			open={props.open}
			setOpen={() => handleViewTransition(() => props.setOpen(false))}
			title={`Edit Dashboard ${props.dashboard ? `(${props.dashboard.title})` : ''}`}
		>
			<form className="h-full" onSubmit={handleAddEditDashboard}>
				<div className="flex flex-col gap-4 p-4">
					<Input name="title" label="Title" placeholder="Dashboard Title" required defaultValue={props.dashboard?.title} />

					<TextAreaInput
						name="description"
						label="Description"
						placeholder="How would you describe this dashboard"
						defaultValue={props.dashboard?.description}
					/>

					{!!props.dashboard ? (
						<TogglerInput name="active" label="Active" required descriptionText="Active dashboards would be visible on the homepage" />
					) : null}
				</div>

				<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
					<Button variant="simple" type="reset">
						Reset
					</Button>
					<Button type="submit">{!!props.dashboard ? 'Update' : 'Create'}</Button>
				</div>
			</form>
		</Modal>
	)
}

export default AddEditDashboard
