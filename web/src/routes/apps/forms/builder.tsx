import { useQuery } from '@tanstack/react-query'
import { FormEvent, MouseEvent, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Form } from '../../../types'
import apiClient from '../../../api/client'
import Loader from '../../../components/lib/loader'
import FormView from '../../../components/formDesigner/formView'

export const Route = createFileRoute('/apps/forms/builder')({
	component: FormBuilderPage,
})

function FormBuilderPage() {
	const navigate = useNavigate()
	const formRef = useRef<HTMLFormElement>(null)
	const { data, isPending } = useQuery<Form>({
		queryKey: ['getForm', { id: 1 }],
		queryFn: async () => apiClient('/forms/1'),
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		try {
			e.preventDefault()
			const formData = Object.fromEntries(
				new FormData(e.target as HTMLFormElement).entries(),
			) as any

			console.log({ formData })
			navigate({ to: data?.successPage || '/' })
		} catch (err: any) {
			navigate({ to: data?.failurePage || '/' })
		}
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		console.log('Cancel')
		formRef.current?.reset()
	}

	if (isPending) return <Loader />

	return (
		<div className="flex h-screen w-full items-center justify-center bg-gray-200 p-4">
			<FormView form={data} {...{ handleCancel, handleSubmit, formRef }} type="fill" />
		</div>
	)
}
