import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, MouseEvent, useRef, useState } from 'react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

import { Form } from '../../../../types'
import apiClient from '../../../../api/client'
import { PageLoader } from '../../../../components/lib/loader'
import { PageNotFound } from '../../../../components/lib/notFound'
import FormView, { ShowMetaType } from '../../../../components/formDesigner/formView'

export const Route = createFileRoute('/apps/forms/$formId/fill')({
	component: FormFill,
})

function FormFill() {
	const navigate = useNavigate()
	const formRef = useRef<HTMLFormElement>(null)
	const [formStatus, setFormStatus] = useState<ShowMetaType>('body')
	const { formId } = useParams({ from: '/apps/forms/$formId/fill' })

	const { data: form, isPending: isGetFormPending } = useQuery<Form>({
		queryKey: ['getForm', formId],
		queryFn: () => apiClient(`/forms/one/${formId}`, { method: 'GET' }),
	})

	function handleFormStatusChange(type: 'success' | 'failure', formMeta?: string) {
		try {
			if (!formMeta) throw new Error('no form meta')
			const safeMeta = JSON.parse(formMeta)
			if (!Array.isArray(safeMeta)) throw new Error('Invalid form meta')

			if (type === 'success') {
				setFormStatus('success')
			} else {
				setFormStatus('failure')
			}
		} catch (err) {
			console.error(err)
		}
	}

	const { isPending } = useMutation({
		mutationKey: ['sumitFormResponse'],
		mutationFn: (data) =>
			apiClient(`/forms/response/submit/${formId}`, {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			formRef.current?.reset()
			handleFormStatusChange('success', form?.successPage)
		},
		onError: (error) => {
			console.error(error)
			handleFormStatusChange('failure', form?.failurePage)
		},
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log(formData)
		formRef.current?.reset()
		handleFormStatusChange('success', form?.successPage)
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		formRef.current?.reset()
	}

	if (!formId || isNaN(parseInt(formId))) return <PageNotFound />
	if (isGetFormPending) return <PageLoader />

	return (
		<div className="flex justify-center p-4">
			<FormView
				{...{ type: 'fill', formRef, handleCancel, handleSubmit, form, showMeta: formStatus }}
			/>
		</div>
	)
}
