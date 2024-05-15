import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import apiClient from '../../../api/client'
import { PageLoader } from '../../lib/loader'
import Table, { TableColumn } from '../../lib/table'
import { CreatedBy, Form, FormResponse, PaginationResponse } from '../../../types'

export type FormResponsesType = {
	form: Form
}

function parseFormResponses(
	form: Form,
	data: PaginationResponse<FormResponse>,
): { res: PaginationResponse<FormResponse>; tableData: Array<TableColumn<any>> } {
	try {
		const formJson = JSON.parse(form.body)
		if (!Array.isArray(formJson)) throw new Error('Invalid form body')

		const formFields: Record<string, [string, boolean]> = {}
		for (let i = 0; i < formJson.length; i++) {
			if (!formJson[i].props || !formJson[i].props.name) continue
			formFields[formJson[i].props.name] = [formJson[i].props.label || formJson[i].props.name, formJson[i].props.required || false]
		}

		const formFieldKeys = Object.keys(formFields)
		const responses: Array<FormResponse> = []
		for (let i = 0; i < data.docs.length; i++) {
			try {
				const formRes = JSON.parse(data.docs[i].response as string)
				for (let j = 0; j < formFieldKeys.length; j++) {
					if (!formRes[formFieldKeys[j]]) formRes[formFieldKeys[j]] = 'N/A'
				}

				responses.push({
					...formRes,
					id: data.docs[i].id,
					deviceIp: data.docs[i].deviceIp,
					createdAt: data.docs[i].createdAt,
					...(!form.allowAnonymousResponse ? { createdByUser: data.docs[i].createdByUser } : {}),
				})
			} catch (err) {
				console.error('Error in parsing form response: ', err)
				continue
			}
		}
		return {
			res: { ...data, docs: responses },
			tableData: Object.entries(formFields).reduce<Array<TableColumn<any>>>(
				(acc, [name, [label]]) => [{ title: label, dataKey: name }, ...acc],
				[
					{
						title: 'Created At',
						dataKey: 'createdAt',
						render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
					},
					...(!form.allowAnonymousResponse
						? [
								{
									title: 'Submitted By',
									dataKey: 'createdByUser',
									render: ({ row: { createdByUser } }: { row: CreatedBy }) => {
										return (
											<div className="flex flex-col">
												<span className="font-semibold">{createdByUser?.name}</span>
												<span className="text-sm text-disabled">{createdByUser?.email}</span>
											</div>
										)
									},
								},
							]
						: []),
				],
			),
		}
	} catch (err) {
		return { res: data, tableData: [] }
	}
}

function FormResponses(props: FormResponsesType) {
	const { data, isPending } = useQuery({
		queryKey: ['getFormResponses', props.form.id],
		queryFn: () => apiClient(`/forms/response/${props.form.id}/all`),
		select: (data) => parseFormResponses(props.form, data),
	})

	if (isPending) return <PageLoader />

	return (
		<Table<any>
			title={`Form Responses (${props.form.title})`}
			rootClassName="w-full"
			description={props.form.description}
			data={data?.res.docs || []}
			columns={data?.tableData || []}
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

export default FormResponses
