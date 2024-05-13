import { useQuery } from '@tanstack/react-query'

import apiClient from '../../../api/client'
import { PageLoader } from '../../lib/loader'
import { Form, FormResponse, PaginationResponse } from '../../../types'

export type FormResponsesType = {
	form: Form
}

function parseFormResponses(
	form: Form,
	data: PaginationResponse<FormResponse>,
): PaginationResponse<FormResponse> {
	try {
		const formJson = JSON.parse(form.body)
		if (!Array.isArray(formJson)) throw new Error('Invalid form body')

		const formFields: Record<string, [string, boolean]> = {}
		for (let i = 0; i < formJson.length; i++) {
			if (!formJson[i].props || !formJson[i].props.name) continue
			formFields[formJson[i].props.name] = [
				formJson[i].props.label || formJson[i].props.name,
				formJson[i].props.required || false,
			]
		}

		const responses: Array<FormResponse> = []
		for (let i = 0; i < data.docs.length; i++) {
			try {
				const formRes = JSON.parse(data.docs[i].response as string)
				responses.push(formRes)
			} catch (err) {
				console.error('Error in parsing form response: ', err)
				continue
			}
		}

		console.log(responses, formFields)

		return {
			...data,
			docs: responses,
		}
	} catch (err) {
		return data
	}
}

function FormResponses(props: FormResponsesType) {
	const { data, isPending } = useQuery({
		queryKey: ['getFormResponses', props.form.id],
		queryFn: () => apiClient(`/forms/response/${props.form.id}/all`, { method: 'GET' }),
		select: (data) => parseFormResponses(props.form, data),
	})

	if (isPending) return <PageLoader />

	return <div>Responses</div>
}

export default FormResponses
