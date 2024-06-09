import { FormEvent, MouseEvent } from 'react'
import { useMutation } from '@tanstack/react-query'

import Modal from '../lib/modal'
import Button from '../lib/button'
import TextInput from '../lib/textInput'
import apiClient from '../../api/client'
import RichTextInput from '../lib/richTextInput'
import { ProjectTask, taskStatuses } from '../../types'
import SingleSelectInput from '../lib/singleSelectInput'
import { capitalizeFirstLetter } from '../../utils/helpers'

type AddEditProjectTaskProps = {
	modalOpen: boolean
	projectId: string
	setModalClose: () => void
	editData: ProjectTask | null
}
function AddEditProjectTask(props: AddEditProjectTaskProps) {
	const { mutate: addProjectTask } = useMutation({
		mutationKey: ['createTask'],
		onSuccess: () => props.setModalClose(),
		mutationFn: (task: Partial<ProjectTask>) => apiClient('/tasks/create', { method: 'POST', body: JSON.stringify(task) }),
	})

	const { mutate: editProjectTask } = useMutation({
		mutationKey: ['editTask'],
		mutationFn: (task: Partial<ProjectTask>) => apiClient(`/tasks/${props.editData?.id}/update`, { method: 'POST', body: JSON.stringify(task) }),
	})

	function handleAddEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		!!props.editData ? editProjectTask({ ...formData }) : addProjectTask({ ...formData, projectId: parseInt(props.projectId) })
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	if (!props.modalOpen) return null

	return (
		<Modal open={props.modalOpen} setOpen={props.setModalClose} title={!!props.editData ? '' : 'Add Project Task'}>
			<form className="flex h-full flex-col gap-4" onSubmit={handleAddEditForm}>
				<TextInput name="title" placeholder="Create the sales pitchdeck" defaultValue={props.editData?.title} label="Title" />
				<SingleSelectInput
					name="status"
					render={({ option }) => (
						<div key={option} className="w-full">
							{option}
						</div>
					)}
					default={props.editData?.status || taskStatuses[0]}
					options={taskStatuses.map((status) => ({ id: status, value: status, label: capitalizeFirstLetter(status) }) as any)}
				/>

				<RichTextInput name="description" defaultValue={props.editData?.description} />

				<div className="flex flex-grow-0 items-center justify-between pt-3">
					<Button variant="simple" onClick={handleReset}>
						Reset
					</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Modal>
	)
}

export default AddEditProjectTask
