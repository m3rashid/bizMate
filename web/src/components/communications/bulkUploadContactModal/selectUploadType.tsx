import { FormEvent, MouseEvent } from 'react'

import Button from '../../lib/button'
import { usePopups } from '../../../hooks/popups'
import { toSentenceCase } from '../../../utils/helpers'
import SingleSelectInput, { Option } from '../../lib/singleSelectInput'
import { uploadFileTypeOptions, useBulkUploadContact } from '../../../hooks/bulkUploadContact'

const options: Array<Option> = uploadFileTypeOptions.map((op) => ({ id: op, label: toSentenceCase(op), value: op }))

function SelectUploadFileType() {
	const { addMessagePopup } = usePopups()
	const { onSelectUploadFileType, resetModal } = useBulkUploadContact()

	function submitResponse(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.fileType || !uploadFileTypeOptions.includes(formData.fileType)) {
			addMessagePopup({ id: 'noFileType', message: 'No file type selected', type: 'error' })
			return
		}

		onSelectUploadFileType(formData.fileType)
	}

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		resetModal()
	}

	return (
		<form className="flex h-full flex-col gap-4" onSubmit={submitResponse}>
			<SingleSelectInput name="fileType" options={options} default={options[0].value} />

			<div className="flex flex-grow-0 items-center justify-between pt-3">
				<Button variant="simple" onClick={handleReset}>
					Cancel
				</Button>
				<Button>Proceed</Button>
			</div>
		</form>
	)
}

export default SelectUploadFileType
