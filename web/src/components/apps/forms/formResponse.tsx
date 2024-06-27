import apiClient from '../../../api/client'
import { Form } from '../../../types'
import Button from '../../lib/button'
import { PageLoader } from '../../lib/loader'
import { NotFound } from '../../lib/notFound'
import Pagination from '../../lib/pagination'
import SimpleTable from '../../lib/simpleTable'
import { parseFormResponses } from './parseFormResponses'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

type FormResponseTableProps = Form
function FormResponsesTable(form: FormResponseTableProps) {
	const [page, setPage] = useState(1)

	const { data: formResponses, isPending: isFormResponseFetchPending } = useQuery({
		queryKey: ['getFormResponses', form.id, page],
		select: (data) => parseFormResponses(form, data),
		queryFn: () => apiClient(`/forms/response/${form.id}/all?page=${page}&limit=10`),
	})

	if (isFormResponseFetchPending) return <PageLoader />
	if (!formResponses) return <NotFound />
	return (
		<>
			<SimpleTable<any>
				rootClassName="w-full"
				description={form.description}
				data={formResponses.data.docs || []}
				columns={formResponses.tableData || []}
				title={`Form Responses (${form.title})`}
				tableExportprops={{ mutationKeys: [], formId: form.id, tableName: 'form_response_table' }}
				otherActions={
					<Link to="/forms/$formId/analytics" params={{ formId: form.id.toString() }}>
						<Button size="small" LeftIcon={<ChartBarIcon className="h-4 w-4" />}>
							Analytics
						</Button>
					</Link>
				}
				emptyState={
					<div className="flex h-72 flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
						<div className="text-center">
							<h3 className="text-lg font-semibold text-gray-800">No responses</h3>
							<p className="text-sm text-gray-500">Share the form link for your audience</p>
						</div>
					</div>
				}
			/>

			<Pagination
				{...{
					...formResponses.data,
					onNextClick: () => setPage((p) => p + 1),
					onPreviousClick: () => setPage((p) => (p != 1 ? p - 1 : p)),
				}}
			/>
		</>
	)
}

export default FormResponsesTable
