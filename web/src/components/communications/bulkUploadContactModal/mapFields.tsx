import Button from '../../lib/button'
import SingleSelectInput from '../../lib/singleSelectInput'
import { camelCaseToSentenceCase } from '../../../utils/helpers'
import { contactFields, useBulkUploadContact } from '../../../hooks/bulkUploadContact'

function MapFields() {
	const { goBack, mappingKeys, mappings, handleSubmitMappings } = useBulkUploadContact()

	return (
		<form className="flex h-full flex-col gap-4" onSubmit={handleSubmitMappings}>
			{contactFields.map((field) => (
				<SingleSelectInput
					key={field}
					name={field}
					options={mappingKeys}
					default={mappings[field] || ''} // handle default values for each field, do not use the empty string for default value
					label={camelCaseToSentenceCase(field)}
				/>
			))}
			<div className="flex flex-grow-0 items-center justify-between pt-3">
				<Button variant="simple" type="button" onClick={goBack}>
					Back
				</Button>
				<Button type="submit">Proceed</Button>
			</div>
		</form>
	)
}

export default MapFields
