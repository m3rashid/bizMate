import apiClient from '@api/client'
import SingleFormView from '@components/formDesigner/singleFormView'
import { PageLoader } from '@components/lib/loader'
import { PageNotFound } from '@components/lib/notFound'
import Tabs from '@components/lib/tabs'
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon'
import { useAuthState } from '@hooks/auth'
import { usePopups } from '@hooks/popups'
import { ApiResponse, Form, FormBodyDocument } from '@mytypes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { FormEvent, MouseEvent, useRef } from 'react'

export const Route = createFileRoute('/$workspaceId/forms/$formId/fill')({
	component: FormFill,
})

function FormFill() {
	const { auth } = useAuthState()
	const { addMessagePopup } = usePopups()
	const formRef = useRef<HTMLFormElement>(null)

	const { formId, workspaceId } = useParams({ from: '/$workspaceId/forms/$formId/fill' })
	const { data: res, isPending } = useQuery<ApiResponse<{ form: Form; formBody: FormBodyDocument }>>({
		queryKey: ['getForm', formId, workspaceId],
		queryFn: () => apiClient(`/${workspaceId}/forms/one/${formId}`),
	})

	const { mutate } = useMutation({
		mutationKey: ['sumitFormResponse'],
		onError: (error) => console.error(error),
		onSuccess: () => formRef.current?.reset(),
		mutationFn: (data: { response: Record<string, any>; pageNumber: number; formBodyId: string }) => {
			return apiClient(`/${workspaceId}/forms/response/${formId}/submit`, { method: 'POST', body: JSON.stringify(data) })
		},
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>, index: number) {
		e.preventDefault()
		if (!res?.data.form) {
			addMessagePopup({ id: 'noForm', message: 'Form not found', type: 'error' })
			return
		}

		try {
			const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
			const currentFormMeta = res.data.formBody.form_inner_body[index].meta
			const toggleInputNames = currentFormMeta.reduce<string[]>((acc, el) => (el.name === 'togglerInput' ? [...acc, el.props.name] : acc), [])
			for (let i = 0; i < toggleInputNames.length; i++)
				formData[toggleInputNames[i]] = formData[toggleInputNames[i]] && formData[toggleInputNames[i]] === 'on' ? true : false

			for (let i = 0; i < currentFormMeta.length; i++) {
				if (typeof formData[currentFormMeta[i].props.name] === 'boolean') continue
				if (currentFormMeta[i].props.required && !formData[currentFormMeta[i].props.name]) {
					addMessagePopup({
						id: 'missingRequiredFields',
						message: `"${currentFormMeta[i].props.label}" is a required field, it must have a value`,
						type: 'error',
					})
					return
				}
			}
			mutate({ response: formData, pageNumber: index, formBodyId: res.data.form.form_body_id })
		} catch (err: any) {
			addMessagePopup({ id: 'errorSubmittingResponse', message: 'Unable to submit response, please try again', type: 'error' })
		}
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>, index: number) {
		console.log(index)
		e.preventDefault()
		formRef.current?.reset()
	}

	if (!formId || formId === 'undefined') return <PageNotFound />
	if (isPending) return <PageLoader />
	if (!res?.data.form) return <PageNotFound />

	if (!res?.data.form.active) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-8 p-4">
				<label className="text-3xl font-bold leading-6 text-gray-900">This Form is not accepting responses</label>
				<FaceFrownIcon className="h-24 w-24" />
			</div>
		)
	}

	if (!res.data.form.allow_anonymous_response && !auth.isAuthenticated) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-8 p-4">
				<label className="text-3xl font-bold leading-6 text-gray-900">You need to be logged in to fill this form</label>
				<FaceFrownIcon className="h-24 w-24" />
			</div>
		)
	}

	return (
		<div className="flex justify-center p-4">
			<Tabs
				rootClassName="md:flex-grow w-full"
				tabClassName="shadow-lg p-3.5 rounded-3xl border-2 border-white hover:border-primary"
				tabs={(res.data.formBody?.form_inner_body || []).map((formInnerBody, index) => ({
					Component: SingleFormView,
					label: `Form Page ${index + 1}`,
					id: formInnerBody.created_at + index,
					componentProps: {
						formRef,
						type: 'fill',
						form: res.data.form,
						singleFormInnerBody: formInnerBody,
						handleSubmit: (e: FormEvent<HTMLFormElement>) => handleSubmit(e, index),
						handleCancel: (e: MouseEvent<HTMLButtonElement>) => handleCancel(e, index),
					},
				}))}
			/>
		</div>
	)
}
