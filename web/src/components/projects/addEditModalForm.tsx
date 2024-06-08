import { Dispatch, FormEvent, MouseEvent, SetStateAction } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import { Project } from '../../types'
import { useMutation } from '@tanstack/react-query'
import apiClient from '../../api/client'
import TextInput from '../lib/textInput'
import TextAreaInput from '../lib/textAreaInput'

type AddEditProjectModalProps = {
	open: boolean
	project?: Project
	refetch: () => void
	setOpen: Dispatch<SetStateAction<boolean>>
}
function AddEditProjectModal(props: AddEditProjectModalProps) {
	function onSuccess() {
		props.setOpen(false)
		props.refetch()
	}

	const { mutate: createNewProject } = useMutation({
		onSuccess,
		mutationKey: ['createNewProject'],
		mutationFn: (project: Partial<Project>) => apiClient('/projects/create', { method: 'POST', body: JSON.stringify(project) }),
	})

	const { mutate: editProject } = useMutation({
		onSuccess,
		mutationKey: ['editProject'],
		mutationFn: (project: Partial<Project>) => apiClient('/projects/update', { method: 'POST', body: JSON.stringify(project) }),
	})

	function handleEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		props.project ? editProject({ ...props.project, ...formData }) : createNewProject(formData)
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	return (
		<Modal open={!!props.project ?? props.open} setOpen={props.setOpen} title={props.project ? 'Edit Project' : 'Create Project'}>
			<form className="flex h-full flex-col gap-4" onSubmit={handleEditForm}>
				<TextInput name="name" label="Name" placeholder="Project Name" required />
				<TextAreaInput name="description" label="Project Description" />
				{/* <div className="flex h-full flex-grow flex-col gap-4 overflow-y-auto"></div> */}

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
export default AddEditProjectModal
