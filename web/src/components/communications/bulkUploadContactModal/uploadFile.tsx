import { useBulkUploadContact } from '../../../hooks/bulkUploadContact'
import Button from '../../lib/button'
import TextInput from '../../lib/textInput'

function UploadFile() {
	const { goBack, goAhead, onFileUpload } = useBulkUploadContact()

	return (
		<div className="flex h-full flex-col gap-4">
			<TextInput type="file" name="file" label="Select file" required onChange={onFileUpload} />

			<div className="flex flex-grow-0 items-center justify-between pt-3">
				<Button variant="simple" onClick={goBack}>
					Back
				</Button>
				<Button onClick={goAhead}>Proceed</Button>
			</div>
		</div>
	)
}

export default UploadFile
