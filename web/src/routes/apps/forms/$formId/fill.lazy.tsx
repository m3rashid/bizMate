import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, MouseEvent, useRef, useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon'

import { Form } from '../../../../types'
import apiClient from '../../../../api/client'
import { useAuth } from '../../../../hooks/auth'
import { PageLoader } from '../../../../components/lib/loader'
import { PageNotFound } from '../../../../components/lib/notFound'
import FormView, { ShowMetaType } from '../../../../components/apps/forms/formView'

export const Route = createFileRoute('/apps/forms/$formId/fill')({
	component: FormFill,
})

function FormFill() {
	const formRef = useRef<HTMLFormElement>(null)
	const {
		auth: { isAuthenticated },
	} = useAuth()
	const { formId } = useParams({ from: '/apps/forms/$formId/fill' })
	const [formStatus, setFormStatus] = useState<ShowMetaType>('body')
	const { data: form, isPending } = useQuery<Form>({ queryKey: ['getForm', formId], queryFn: () => apiClient(`/forms/one/${formId}`) })

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

	const { mutate } = useMutation({
		mutationKey: ['sumitFormResponse'],
		mutationFn: (data: { response: any }) =>
			apiClient(`/forms/response/${formId}/submit`, {
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
		mutate({ response: JSON.stringify(formData) })
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		formRef.current?.reset()
	}

	if (!formId || isNaN(parseInt(formId))) return <PageNotFound />
	if (isPending) return <PageLoader />
	if (!form) return <PageNotFound />
	if (!form.active) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-8 p-4">
				<label className="text-3xl font-bold leading-6 text-gray-900">This Form is not accepting responses</label>
				<FaceFrownIcon className="h-24 w-24" />
			</div>
		)
	}

	if (!form.allowAnonymousResponse && !isAuthenticated) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-8 p-4">
				<label className="text-3xl font-bold leading-6 text-gray-900">You need to be logged in to fill this form</label>
				<FaceFrownIcon className="h-24 w-24" />
			</div>
		)
	}
	return (
		<div className="flex justify-center p-4">
			<FormView {...{ type: 'fill', formRef, handleCancel, handleSubmit, form, showMeta: formStatus }} />
		</div>
	)
}
