import apiClient from '@api/client'
import FormView, { ShowMetaType } from '@components/apps/forms/formView'
import { FormElementInstance } from '@components/forms/constants'
import { PageLoader } from '@components/lib/loader'
import { PageNotFound } from '@components/lib/notFound'
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon'
import { useAuthState } from '@hooks/auth'
import { usePopups } from '@hooks/popups'
import { Form } from '@mytypes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { FormEvent, MouseEvent, useRef, useState } from 'react'

export const Route = createFileRoute('/$workspaceId/forms/$formId/fill')({
	component: FormFill,
})

function FormFill() {
	const { auth } = useAuthState()
	const { addMessagePopup } = usePopups()
	const formRef = useRef<HTMLFormElement>(null)

	const { formId, workspaceId } = useParams({ from: '/$workspaceId/forms/$formId/fill' })
	const [formStatus, setFormStatus] = useState<ShowMetaType>('body')
	const { data: form, isPending } = useQuery<Form>({ queryKey: ['getForm', formId, workspaceId], queryFn: () => apiClient(`/forms/one/${formId}`) })

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
		if (!form) {
			addMessagePopup({ id: 'noForm', message: 'Form not found', type: 'error' })
			return
		}

		try {
			const formBody: FormElementInstance[] = JSON.parse(form.body)
			const toggleInputNames = formBody.reduce<string[]>((acc, el) => (el.name === 'togglerInput' ? [...acc, el.props.name] : acc), [])
			const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any

			for (let i = 0; i < toggleInputNames.length; i++) {
				// make sure the toggle inputs give true/false as results rather than on and off
				if (formData[toggleInputNames[i]] && formData[toggleInputNames[i]] === 'on') {
					formData[toggleInputNames[i]] = true
				} else formData[toggleInputNames[i]] = false
			}

			for (let i = 0; i < formBody.length; i++) {
				if (typeof formData[formBody[i].props.name] === 'boolean') continue
				if (formBody[i].props.required && !formData[formBody[i].props.name]) {
					addMessagePopup({
						id: 'missingRequiredFields',
						message: `"${formBody[i].props.label}" is a required field, it must have a value`,
						type: 'error',
					})
					return
				}
			}

			mutate({ response: JSON.stringify(formData) })
		} catch (err: any) {
			addMessagePopup({ id: 'errorSubmittingResponse', message: 'Unable to submit response, please try again', type: 'error' })
		}
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

	if (!form.allowAnonymousResponse && !auth.isAuthenticated) {
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
