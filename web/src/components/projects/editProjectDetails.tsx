import { useMutation } from '@tanstack/react-query'
import { FormEvent, MouseEvent, useState } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import { Project } from '../../types'
import apiClient from '../../api/client'
import RichTextInput from '../lib/richTextInput'

type ProjectDetailType = 'readme' | 'guidelines' | 'documentation'
export type EditProjectDetailsProps = Project

function EditProjectDetails(project: EditProjectDetailsProps) {
	const [type, setType] = useState<ProjectDetailType | null>(null)

	const { mutate: editProject } = useMutation({
		onSuccess: () => setType(null),
		mutationKey: ['editProject', project.id],
		mutationFn: (data: Partial<Project>) => apiClient(`/projects/${project.id}/update`, { method: 'POST', body: JSON.stringify(data) }),
	})

	function handleEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (type) editProject({ [type]: formData[type] })
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	if (!project.id) return null
	return (
		<>
			<div className="flex flex-col items-center justify-between gap-4 rounded-lg p-2 px-4 shadow-md md:flex-row">
				<h3 className="text-xl font-bold">{project.name}</h3>
				<div className="flex items-center justify-center gap-4">
					<Button size="small" onClick={() => setType('readme')}>
						Edit Readme
					</Button>
					<Button size="small" onClick={() => setType('guidelines')}>
						Edit Guidelines
					</Button>
					<Button size="small" onClick={() => setType('documentation')}>
						Edit Documentation
					</Button>
				</div>
			</div>

			<Modal open={!!type} setOpen={() => setType(null)} title={`Edit ${type}`}>
				<form className="flex h-full w-full flex-col gap-4" onSubmit={handleEditForm}>
					{type ? <RichTextInput defaultValue={project[type]} name={type} /> : null}

					<div className="flex flex-grow-0 items-center justify-between pt-3">
						<Button variant="simple" onClick={handleReset}>
							Reset
						</Button>
						<Button type="submit">Save</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}

export default EditProjectDetails
