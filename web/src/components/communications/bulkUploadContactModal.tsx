import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useState } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import apiClient from '../../api/client'

type BulkUploadContactModalProps = {
	open: boolean
	refetch: () => void
	setOpen: Dispatch<SetStateAction<boolean>>
}

function BulkUploadContactModal(props: BulkUploadContactModalProps) {
	const [modalState, setModalState] = useState<'upload' | 'mapping'>('upload')

	const { mutate: bulkUploadContacts } = useMutation({
		onSuccess: () => {
			props.refetch()
			props.setOpen(false)
		},
		mutationKey: ['createBulkUploadContacts'],
		mutationFn: (data) => apiClient('/contacts/bulk-upload', { method: 'POST', body: JSON.stringify(data) }),
	})

	return (
		<Modal
			open={props.open}
			setOpen={props.setOpen}
			title={modalState === 'upload' ? 'Upload File' : modalState === 'mapping' ? 'Create contact mapping' : ''}
		>
			{modalState === 'upload' ? (
				<div className="">
					<p className="">Upload State</p>
					<Button label="Next" onClick={() => setModalState('mapping')} />
				</div>
			) : modalState === 'mapping' ? (
				<div className="">
					<p className="">Mapping state</p>
					<Button label="Next" onClick={() => setModalState('upload')} />
				</div>
			) : null}
		</Modal>
	)
}

export default BulkUploadContactModal
