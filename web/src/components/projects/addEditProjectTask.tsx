import { FormEvent, MouseEvent } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import TextInput from '../lib/textInput'
import { taskStatuses } from '../../types'
import RichTextInput from '../lib/richTextInput'
import SingleSelectInput from '../lib/singleSelectInput'
import { capitalizeFirstLetter } from '../../utils/helpers'
import { useProjectKanban } from '../../hooks/projectKanban'

function AddEditProjectTask() {
	const {
		setAddEditModalOpen,
		projectKanban: { editData, addEditModalOpen },
	} = useProjectKanban()
	function handleEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log(formData)
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	return (
		<Modal open={addEditModalOpen} setOpen={setAddEditModalOpen} title={!!editData ? '' : 'Add Project Task'}>
			<form className="flex h-full flex-col gap-4" onSubmit={handleEditForm}>
				<TextInput name="title" placeholder="Create the sales pitchdeck" defaultValue={editData?.title} label="Title" />
				<RichTextInput name="description" defaultValue={editData?.description} />
				<SingleSelectInput
					name="status"
					render={({ option }) => (
						<div key={option} className="w-full">
							{option}
						</div>
					)}
					default={editData?.status || taskStatuses[0]}
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

export default AddEditProjectTask
