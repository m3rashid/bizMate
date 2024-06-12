import { useQuery } from '@tanstack/react-query'

import { Form } from '../../../types'
import apiClient from '../../../api/client'
import { PageLoader } from '../../lib/loader'
import { NotFound } from '../../lib/notFound'
import SimpleTable from '../../lib/simpleTable'
import { parseFormResponses } from './parseFormResponses'

type FormResponseTableProps = Form
function FormResponsesTable(form: FormResponseTableProps) {
	const { data: formResponses, isPending: isFormResponseFetchPending } = useQuery({
		queryKey: ['getFormResponses', form.id],
		select: (data) => parseFormResponses(form, data),
		queryFn: () => apiClient(`/forms/response/${form.id}/all`),
	})

	if (isFormResponseFetchPending) return <PageLoader />
	if (!formResponses) return <NotFound />

	return (
		<SimpleTable<any>
			rootClassName="w-full"
			description={form.description}
			data={formResponses.data.docs || []}
			columns={formResponses.tableData || []}
			title={`Form Responses (${form.title})`}
			tableExportprops={{ mutationKeys: [], formId: form.id, tableName: 'form_response_table' }}
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
