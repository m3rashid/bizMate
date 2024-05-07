import { FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import FormBuilder from '../../../components/forms'
import Button from '../../../components/lib/button'

export const Route = createFileRoute('/apps/forms/builder')({
	component: () => <FormBuilderPage />,
})

function FormBuilderPage() {
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log(formData)
	}

	return (
		<div className="flex h-screen w-full items-center justify-center bg-gray-200 p-4">
			<form className="flex w-full min-w-72 max-w-[600px] flex-col gap-4 rounded-lg bg-white p-8" onSubmit={handleSubmit}>
				<FormBuilder
					meta={[
						{
							key: 'txt-1',
							name: 'textInput',
							props: {
								label: 'My input',
								name: 'myinput',
							},
						},
						{
							key: 'ph-1',
							name: 'phoneNumberInput',
							props: {
								label: 'Enter contact number',
								name: 'phone',
							},
						},
					]}
				/>

				<Button type="submit" label="Submit Form" />
			</form>
		</div>
	)
}
