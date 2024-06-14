import { twMerge } from 'tailwind-merge'
import { useMutation } from '@tanstack/react-query'

import Button from '../../lib/button'
import apiClient from '../../../api/client'
import { usePopups } from '../../../hooks/popups'
import { BulkUploadContactModalProps, useBulkUploadContact } from '../../../hooks/bulkUploadContact'

function Confirm(props: BulkUploadContactModalProps) {
	const { addMessagePopup } = usePopups()
	const { goBack, mappings, file } = useBulkUploadContact()
	const { mutate: bulkUploadContacts } = useMutation({
		onSuccess: () => {
			props.refetch()
			props.setOpen(false)
		},
		mutationKey: ['createBulkUploadContacts'],
		// backend not implemented [POST /contacts/bulk-upload]
		mutationFn: (data: FormData) => apiClient('/contacts/bulk-upload', { method: 'POST', body: data }),
	})

	function handleConfirmUpload() {
		if (!file) {
			addMessagePopup({ id: 'noFile', message: 'No file selected', type: 'error' })
			return
		}

		if (!mappings.name || !mappings.email) {
			addMessagePopup({ id: 'noMapping', message: 'Name and Email are required', type: 'error' })
			return
		}

		const formData = new FormData()
		formData.append('file', file)
		formData.append('mappings', JSON.stringify(mappings))
		bulkUploadContacts(formData)
	}

	return (
		<div className="flex h-full w-full flex-col items-center gap-4">
			<div className="w-full text-center">
				<h3 className="text-lg font-bold">Are you sure?</h3>
				<p className="">Are you sure to create contact with the mappings below?</p>
			</div>

			<table className="w-full border-2 border-borderColor">
				<tr className="bg-borderColor">
					<td className="p-2 font-semibold ">Contact Column</td>
					<td className="p-2 font-semibold">Mapped Column</td>
				</tr>
				{Object.entries(mappings).map(([key, value]) => {
					return (
						<tr key={key} className="text-sm">
							<td className="p-1.5">{key}</td>
							<td className={twMerge('p-1.5', value ? '' : 'text-disabled')}>{value || 'No mapping Specified'}</td>
						</tr>
					)
				})}
			</table>

			<div className="flex w-full flex-grow-0 items-center justify-between pt-3">
				<Button variant="simple" onClick={goBack}>
					Back
				</Button>
				<Button onClick={handleConfirmUpload}>Proceed</Button>
			</div>
		</div>
	)
}

export default Confirm
