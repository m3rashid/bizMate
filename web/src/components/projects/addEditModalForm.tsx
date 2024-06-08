import { Dispatch, SetStateAction } from 'react'
import Modal from '../lib/modal'
import { Project } from '../../types'

type AddEditProjectModalProps = {
	open: boolean
	project?: Project
	setOpen: Dispatch<SetStateAction<boolean>>
}
function AddEditProjectModal(props: AddEditProjectModalProps) {
	return (
		<Modal open={!!props.project ?? props.open} setOpen={props.setOpen} title={props.project ? 'Edit Project' : 'Create Project'}>
			{/*  */}
		</Modal>
	)
}
export default AddEditProjectModal
