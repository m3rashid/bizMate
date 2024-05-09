import { FormEvent, MouseEvent, RefObject } from 'react'

import { Form } from '../../types'
import FormBuilder from '../forms'
import Button from '../lib/button'
import { FormElementInstance } from '../forms/constants'

export type FormViewProps = {
	form?: Form
	type: 'preview' | 'fill'
	formRef: RefObject<HTMLFormElement>
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void
	handleCancel: (e: MouseEvent<HTMLButtonElement>) => void
}

function FormView(props: FormViewProps) {
	if (!props.form) return null

	return (
		<form
			ref={props.formRef}
			onSubmit={props.handleSubmit}
			className="flex w-full min-w-80 max-w-[800px] flex-col gap-4"
		>
			<FormBuilder
				className="flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md"
				meta={JSON.parse(props.form.body) as FormElementInstance[]}
			/>

			<div className="flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md">
				<Button
					variant="simple"
					onClick={props.handleCancel}
					label={props.form.cancelText}
					disabled={props.type === 'preview'}
				/>
				<Button
					type="submit"
					variant="primary"
					label={props.form.submitText}
					disabled={props.type === 'preview'}
				/>
			</div>
		</form>
	)
}

export default FormView
