import FormBuilder from '@components/forms'
import Button from '@components/lib/button'
import { Form, FormBodyMeta } from '@mytypes'
import { FormEvent, MouseEvent, RefObject } from 'react'

export type SingleFormViewProps = {
	form?: Form
	singleFormInnerBody?: FormBodyMeta
	onPreviousClick: (e: MouseEvent<HTMLButtonElement>) => void
	previousDisabled: boolean
	nextDisabled: boolean
} & (
	| { type: 'preview'; onNextClick: (e: MouseEvent<HTMLButtonElement>) => void }
	| { type: 'fill'; formRef: RefObject<HTMLFormElement>; onNextClick: (e: FormEvent<HTMLFormElement>) => void }
)

function SingleFormView(props: SingleFormViewProps) {
	if (!props.form || !props.singleFormInnerBody) return null

	return (
		<form
			className="mb-8 flex w-full min-w-80 max-w-[650px] flex-col gap-4"
			{...(props.type === 'fill' ? { ref: props.formRef, onSubmit: props.onNextClick } : {})}
		>
			<FormBuilder
				meta={props.singleFormInnerBody.meta}
				className="flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md"
			/>
			<div className="flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md">
				<Button variant="simple" onClick={props.onPreviousClick} disabled={props.previousDisabled} label={props.singleFormInnerBody.previous_text} />
				<Button
					type="submit"
					variant="primary"
					disabled={props.nextDisabled}
					label={props.singleFormInnerBody.next_text}
					{...(props.type === 'preview' ? { onClick: props.onNextClick } : {})}
				/>
			</div>
		</form>
	)
}

export default SingleFormView
