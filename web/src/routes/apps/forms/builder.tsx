import { createFileRoute } from '@tanstack/react-router'
import FormBuilder from '../../../components/forms'
import { FormEvent } from 'react'

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
		<form onSubmit={handleSubmit}>
			<FormBuilder
				meta={[
					{
						key: 'txt-1',
						name: 'textInput',
						props: {
							label: 'My input',
							name: 'inputr',
						},
					},
					{
						key: 'ph-1',
						name: 'phoneNumberInput',
						props: {
							label: 'Enter contact number',
						},
					},
					{
						key: 'bt1',
						name: 'button',
						props: {
							variant: 'primary',
							type: 'submit',
						},
						children: [
							{
								key: 'p-1',
								name: 'typography',
								props: {
									value: 'Hello',
								},
							},
						],
					},
				]}
			/>
		</form>
	)
}
