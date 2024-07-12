import { parseFormResponses } from './parseFormResponses'
import apiClient from '@api/client'
import Button from '@components/lib/button'
import { PageLoader } from '@components/lib/loader'
import { NotFound } from '@components/lib/notFound'
import Pagination from '@components/lib/pagination'
import SimpleTable from '@components/lib/simpleTable'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { Form } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

type FormResponseTableProps = Form & { workspaceId: string }
function FormResponsesTable(props: FormResponseTableProps) {
	const [page, setPage] = useState(1)

	const { data: formResponses, isPending: isFormResponseFetchPending } = useQuery({
		queryKey: ['getFormResponses', props.id, page, props.workspaceId],
		select: (data) => parseFormResponses(props, data),
		queryFn: () => apiClient(`/${props.workspaceId}/forms/response/${props.id}/all?page=${page}&limit=10`),
	})

	if (isFormResponseFetchPending) return <PageLoader />
	if (!formResponses) return <NotFound />
	return (
		<>
			<SimpleTable<any>
				rootClassName="w-full"
				description={props.description}
				data={formResponses.data.docs || []}
				columns={formResponses.tableData || []}
				title={`Form Responses (${props.title})`}
				tableExportprops={{ mutationKeys: [], formId: props.id, tableName: 'form_response_table', workspaceId: props.workspaceId }}
				otherActions={
					<Link to="/$workspaceId/forms/$formId/analytics" params={{ formId: props.id, workspaceId: props.workspaceId }}>
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
