import dayjs from 'dayjs'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, FormEvent, MouseEvent, SetStateAction } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import { Contact } from '../../types'
import apiClient from '../../api/client'
import TextInput from '../lib/textInput'
import PhoneNumberInput from '../lib/phoneNumberInput'

type AddEditContactModalProps = {
	open: boolean
	contact?: Contact
	refetch: () => void
	setOpen: Dispatch<SetStateAction<boolean>>
}

function AddEditContactModal(props: AddEditContactModalProps) {
	function onSuccess() {
		props.setOpen(false)
		props.refetch()
	}

	const { mutate: createNewContact } = useMutation({
		onSuccess,
		mutationKey: ['createNewContact'],
		mutationFn: (data: any) => apiClient('/contacts/create', { method: 'POST', body: JSON.stringify(data) }),
	})

	const { mutate: editContact } = useMutation({
		onSuccess,
		mutationKey: ['editContact'],
		mutationFn: (data: any) => apiClient(`/contacts/${props.contact?.id}/update`, { method: 'POST', body: JSON.stringify(data) }),
	})

	function handleAddEditContact(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		const birthday = dayjs(formData.birthday).toISOString()
		props.contact
			? editContact({ ...formData, birthday })
			: createNewContact({ ...formData, birthday, otherPhones: [], otherEmails: [], otherDetails: {} })
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	return (
		<Modal open={props.open} setOpen={props.setOpen} title={props.contact ? 'Edit Contact' : 'Create Contact'}>
			<form className="flex h-full flex-col gap-4" onSubmit={handleAddEditContact}>
				<TextInput name="name" label="Name" defaultValue={props.contact?.name} required />
				<TextInput name="email" label="Email" defaultValue={props.contact?.email} required />
				<PhoneNumberInput name="phone" label="Phone" defaultValue={props.contact?.phone} />
				<TextInput name="birthday" label="Birthday" defaultValue={props.contact?.birthday} />

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

export default AddEditContactModal
