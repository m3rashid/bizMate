import { useQuery } from '@tanstack/react-query'

import { Form } from '../../../types'
import apiClient from '../../../api/client'
import { PageLoader } from '../../lib/loader'
import SimpleTable from '../../lib/simpleTable'
import { parseFormResponses } from './parseFormResponses'

type FormResponseTableProps = { formId: string; form: Form }
function FormResponsesTable(props: FormResponseTableProps) {
	const { data: formResponses, isPending: isFormResponseFetchPending } = useQuery({
		queryKey: ['getFormResponses', props.formId],
		select: (data) => parseFormResponses(props.form, data),
		queryFn: () => apiClient(`/forms/response/${props.formId}/all`),
	})

	if (isFormResponseFetchPending) return <PageLoader />
	return (
		<SimpleTable<any>
			title={`Form Responses (${props.form.title})`}
			rootClassName="w-full"
			description={props.form.description}
			data={formResponses?.data.docs || []}
			columns={formResponses?.tableData || []}
			emptyState={
				<div className="flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
					<div className="text-center">
						<h3 className="text-lg font-semibold text-gray-800">No responses</h3>
						<p className="text-sm text-gray-500">Share the form link for your audience</p>
					</div>
				</div>
			}
		/>
	)
}

export default FormResponsesTable
