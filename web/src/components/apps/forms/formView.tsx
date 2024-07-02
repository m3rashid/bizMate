import FormBuilder from '@components/forms'
import { FormElementInstance } from '@components/forms/constants'
import Button from '@components/lib/button'
import { Form } from '@mytypes'
import { FormEvent, MouseEvent, RefObject } from 'react'

export type ShowMetaType = 'body' | 'success' | 'failure'
export type FormViewProps = {
	form?: Form
	showMeta?: ShowMetaType
} & (
	| { type: 'preview' }
	| {
			type: 'fill'
			formRef: RefObject<HTMLFormElement>
			handleSubmit: (e: FormEvent<HTMLFormElement>) => void
			handleCancel: (e: MouseEvent<HTMLButtonElement>) => void
	  }
)

function FormView(props: FormViewProps) {
	if (!props.form) return null
	const metaType = props.showMeta || 'body'

	return (
		<form
			{...(props.type === 'fill' && metaType === 'body' ? { ref: props.formRef, onSubmit: props.handleSubmit } : {})}
			className="flex w-full min-w-80 max-w-[800px] flex-col gap-4"
		>
			<FormBuilder
				className="flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md"
				meta={
					JSON.parse(
						metaType === 'body' ? props.form.body : metaType === 'success' ? props.form.successPage : props.form.failurePage,
					) as FormElementInstance[]
				}
			/>

			{metaType === 'body' ? (
				<div className="flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md">
					<Button
						variant="simple"
						label={props.form.cancelText}
						disabled={props.type === 'preview'}
						{...(props.type === 'fill' ? { onClick: props.handleCancel } : {})}
					/>
					<Button type="submit" variant="primary" label={props.form.submitText} disabled={props.type === 'preview'} />
				</div>
			) : null}
		</form>
	)
}

export default FormView
