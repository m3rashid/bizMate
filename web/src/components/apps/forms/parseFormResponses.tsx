import dayjs from 'dayjs'
import { useState } from 'react'

import Modal from '../../lib/modal'
import Button from '../../lib/button'
import { TableColumn } from '../../lib/table'
import ShowRichText from '../../lib/showRichText'
import { FormElementInstance } from '../../forms/constants'
import { CreatedBy, Form, FormResponse, PaginationResponse } from '../../../types'

export type FormResponsesType = {
	form: Form
}

function ShowRichTextData(props: { data: any; label: string }) {
	const [modalOpen, setModalOpen] = useState(false)
	return (
		<>
			<Button size="small" onClick={() => setModalOpen(true)}>
				Show Contents
			</Button>
			<Modal open={modalOpen} setOpen={setModalOpen} title={props.label}>
				<ShowRichText data={props.data} className="my-0 border-2 border-borderColor p-0 shadow-none" />
			</Modal>
		</>
	)
}

export function parseFormResponses(
	form: Form,
	data: PaginationResponse<FormResponse>,
): { data: PaginationResponse<FormResponse>; tableData: Array<TableColumn<any>> } {
	try {
		const formJson: FormElementInstance[] = JSON.parse(form.body)
		if (!Array.isArray(formJson)) throw new Error('Invalid form body')

		const formFields: Record<string, [string, boolean, boolean]> = {} // Record<name, [label, required, isRichTextField]>
		for (let i = 0; i < formJson.length; i++) {
			if (!formJson[i].props || !formJson[i].props.name) continue
			formFields[formJson[i].props.name] = [
				formJson[i].props.label || formJson[i].props.name,
				formJson[i].props.required || false,
				formJson[i].name === 'richTextInput',
			]
		}

		const formFieldKeys = Object.keys(formFields)
		const responses: Array<FormResponse> = []
		for (let i = 0; i < data.docs.length; i++) {
			try {
				const formRes = JSON.parse(data.docs[i].response as string)
				for (let j = 0; j < formFieldKeys.length; j++) {
					if (typeof formRes[formFieldKeys[j]] !== 'boolean' && !formRes[formFieldKeys[j]]) formRes[formFieldKeys[j]] = 'N/A'
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
			data: { ...data, docs: responses },
			tableData: Object.entries(formFields).reduce<Array<TableColumn<any>>>(
				(acc, [name, [label, _, isRichTextField]]) => [
					isRichTextField
						? {
								title: label,
								dataKey: name,
								render: ({ row }) => <ShowRichTextData data={row[name]} label={label} />,
							}
						: { title: label, dataKey: name },
					...acc,
				],
				[
					{ title: 'Created At', dataKey: 'createdAt', render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A') },
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
		return { data: data, tableData: [] }
	}
}
