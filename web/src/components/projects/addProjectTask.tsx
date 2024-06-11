import { useMutation } from '@tanstack/react-query'
import { Dispatch, FormEvent, MouseEvent, SetStateAction } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import TextInput from '../lib/textInput'
import apiClient from '../../api/client'
import { ProjectTask, taskStatuses } from '../../types'
import SingleSelectInput from '../lib/singleSelectInput'
import { capitalizeFirstLetter } from '../../utils/helpers'

type AddProjectTaskProps = {
	modalOpen: boolean
	projectId: string
	setModalOpen: Dispatch<SetStateAction<boolean>>
	parentTaskId?: number
	refetch: () => void
}
function AddProjectTask(props: AddProjectTaskProps) {
	const { mutate: addProjectTask } = useMutation({
		mutationKey: ['createTask'],
		onSuccess: () => {
			props.refetch()
			props.setModalOpen(false)
		},
		mutationFn: (task: Partial<ProjectTask>) => apiClient('/tasks/create', { method: 'POST', body: JSON.stringify(task) }),
	})

	function handleAddEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		addProjectTask({
			...formData,
			projectId: parseInt(props.projectId),
			...(props.parentTaskId ? { parentTaskId: props.parentTaskId } : {}),
		})
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	if (!props.modalOpen) return null

	return (
		<Modal open={props.modalOpen} setOpen={props.setModalOpen} title="Add Project Task">
			<form className="flex h-full flex-col gap-4" onSubmit={handleAddEditForm}>
				<TextInput name="title" placeholder="Create the sales pitchdeck" label="Title" />
				<SingleSelectInput
					name="status"
					label="Status"
					render={({ option }) => (
						<div key={option} className="w-full">
							{option}
						</div>
					)}
					default={taskStatuses[0]}
					options={taskStatuses.map((status) => ({ id: status, value: status, label: capitalizeFirstLetter(status) }) as any)}
				/>

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

export default AddProjectTask
