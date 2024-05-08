import { twMerge } from 'tailwind-merge'
import { FormEvent, MouseEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import FormBuilder from '../../../components/forms'
import Button from '../../../components/lib/button'

export const Route = createFileRoute('/apps/forms/builder')({
	component: FormBuilderPage,
})

function FormBuilderPage() {
	const rootClasses = 'rounded-lg bg-white p-4 shadow-md'
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log({ formData })
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		console.log('Cancel')
		const form = (e.target as any).parentNode.parentNode
		form.reset({ errors: {} })
	}

	return (
		<div className="flex h-screen w-full items-center justify-center bg-gray-200 p-4">
			<form onSubmit={handleSubmit} className="flex w-full min-w-72 max-w-[600px] flex-col gap-4 ">
				<FormBuilder
					className={twMerge(rootClasses, '')}
					meta={[
						{
							id: 'img',
							name: 'image',
							props: {
								src: 'https://via.placeholder.com/150',
								alt: 'placeholder image',
								className: 'w-full h-48 object-cover rounded-md',
							},
						},
					]}
				/>

				<FormBuilder meta={[]} className={twMerge(rootClasses, 'p-8')} />

				<div className={twMerge(rootClasses, 'flex items-center justify-between')}>
					<Button type="submit" label="Submit Form" />
					<Button onClick={handleCancel} variant="simple" label="Cancel" />
				</div>
			</form>
		</div>
	)
}
