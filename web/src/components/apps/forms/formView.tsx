import FormBuilder from '@components/forms'
import Button from '@components/lib/button'
import { Form, FormBodyDocument } from '@mytypes'
import { useNavigate } from '@tanstack/react-router'
import { FormEvent, Fragment, MouseEvent, RefObject } from 'react'

export type ShowMetaType = 'body' | 'success' | 'failure'
export type FormViewProps = {
	form?: Form
	formBody?: FormBodyDocument
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
	const navigate = useNavigate()

	if (!props.form) return null
	return (
		<Fragment>
			<Button
				onClick={() =>
					navigate({
						to: '/$workspaceId/forms/$formId/designer',
						params: { formId: props.form?.id || '', workspaceId: props.form?.workspace_id || '' },
					})
				}
				size="small"
			>
				{props.formBody && props.formBody.formInnerBody.length > 0 ? 'Add More form Pages' : 'Add form pages'}
			</Button>

			{props.formBody?.formInnerBody.map((singleFormBody) => (
				<form
					{...(props.type === 'fill' ? { ref: props.formRef, onSubmit: props.handleSubmit } : {})}
					className="flex w-full min-w-80 max-w-[800px] flex-col gap-4"
				>
					<FormBuilder className="flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md" meta={singleFormBody.meta} />

					<div className="flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md">
						<Button
							variant="simple"
							label={props.form?.cancel_text}
							disabled={props.type === 'preview'}
							{...(props.type === 'fill' ? { onClick: props.handleCancel } : {})}
						/>
						<Button type="submit" variant="primary" label={props.form?.submit_text} disabled={props.type === 'preview'} />
					</div>
				</form>
			))}
		</Fragment>
	)
}

export default FormView
