import FormBuilder from '@components/forms'
import Button from '@components/lib/button'
import { Form, FormInnerBody } from '@mytypes'
import { FormEvent, MouseEvent, RefObject } from 'react'

export type SingleFormViewProps = {
	form?: Form
	singleFormInnerBody?: FormInnerBody
} & (
	| { type: 'preview' }
	| {
			type: 'fill'
			formRef: RefObject<HTMLFormElement>
			handleSubmit: (e: FormEvent<HTMLFormElement>) => void
			handleCancel: (e: MouseEvent<HTMLButtonElement>) => void
	  }
)

function SingleFormView(props: SingleFormViewProps) {
	if (!props.form || !props.singleFormInnerBody) return null
	return (
		<form
			className="mb-8 flex w-full min-w-80 max-w-[650px] flex-col gap-4"
			{...(props.type === 'fill' ? { ref: props.formRef, onSubmit: props.handleSubmit } : {})}
		>
			<FormBuilder
				className="flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md"
				meta={props.singleFormInnerBody.meta}
			/>
			<div className="flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md">
				<Button
					variant="simple"
					label={props.singleFormInnerBody.cancel_text}
					disabled={props.type === 'preview'}
					{...(props.type === 'fill' ? { onClick: props.handleCancel } : {})}
				/>
				<Button type="submit" variant="primary" label={props.singleFormInnerBody.submit_text} disabled={props.type === 'preview'} />
			</div>
		</form>
	)
}

export default SingleFormView
