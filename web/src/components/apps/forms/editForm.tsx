import apiClient from '@api/client'
import { FormElementInstance, SupportedWidgetName } from '@components/forms/constants'
import FormRenderer from '@components/forms/renderer'
import Button from '@components/lib/button'
import Modal from '@components/lib/modal'
import { usePopups } from '@hooks/popups'
import { Form, StringBoolean } from '@mytypes'
import { useMutation } from '@tanstack/react-query'
import { camelCaseToSentenceCase } from '@utils/helpers'
import { FormEvent, useMemo } from 'react'

export type AddEditFormProps = { open: boolean; onClose: () => void; workspaceId: string; refetch: () => void } & (
	| { form: undefined }
	| { form: Form }
)

function editFormMeta(form: Array<[keyof Form, string | boolean, string, SupportedWidgetName, boolean?, Record<string, any>?]>) {
	// Array<[name, value, descriptionText, type, required]>
	const meta: FormElementInstance[] = []
	for (let i = 0; i < form.length; i++) {
		meta.push({
			id: form[i][0],
			name: form[i][3],
			props: {
				name: form[i][0],
				required: form[i][4],
				defaultValue: form[i][1],
				descriptionText: form[i][2],
				label: camelCaseToSentenceCase(form[i][0]),
				...(form[i][5] || {}),
			},
		})
	}

	return meta
}

function AddEditForm(props: AddEditFormProps) {
	const { addMessagePopup } = usePopups()
	const { mutate: createForm } = useMutation({
		mutationKey: ['createForm'],
		mutationFn: (form: Partial<Form>) => apiClient(`/${props.workspaceId}/forms/create`, { method: 'POST', body: JSON.stringify(form) }),
		onSuccess: () => {
			props.onClose()
			addMessagePopup({ id: 'successCreatingForm', message: 'Form created successfully', type: 'success' })
			props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'errorCreatingForm', message: 'An Error occured in creating form', type: 'error' })
		},
	})

	const { mutate: updateForm } = useMutation({
		mutationKey: ['editForm'],
		mutationFn: (form: Partial<Form>) => apiClient(`/${props.workspaceId}/forms/update`, { method: 'POST', body: JSON.stringify(form) }),
		onSuccess: () => {
			props.onClose()
			addMessagePopup({ id: 'successUpdatingForm', message: 'Form updated successfully', type: 'success' })
			props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'errorUpdatingForm', message: 'An Error occured in updating form', type: 'error' })
		},
	})

	const meta = useMemo(() => {
		return editFormMeta([
			['title', props.form?.title || '', 'Form title', 'input', true],
			['description', props.form?.description || '', 'Form description', 'textareaInput'],
			['cancel_text', props.form?.cancel_text || 'Cancel', 'Cancel button text', 'input', true],
			['submit_text', props.form?.submit_text || 'Submit', 'Submit button text', 'input', true],
			[
				'allow_anonymous_response',
				props.form?.allow_anonymous_response ? 'on' : 'off',
				'Does the user need to be logged in to fill this form?',
				'togglerInput',
				true,
				{ defaultChecked: props.form?.allow_anonymous_response },
			],
			[
				'allow_multiple_response',
				props.form?.allow_multiple_response ? 'on' : 'off',
				'Can the user submit multiple responses?',
				'togglerInput',
				true,
				{ defaultChecked: props.form?.allow_multiple_response },
			],
			[
				'is_step_form',
				props.form?.is_step_form ? 'on' : 'off',
				'Do you want to ask questions one by one from the user?',
				'togglerInput',
				true,
				{ defaultChecked: props.form?.is_step_form },
			],
			['active', props.form?.active ? 'on' : 'off', 'Is this form active', 'togglerInput', true, { defaultChecked: props.form?.active }],
		])
	}, [props.form?.id])

	function handleStringBoolean(entry?: StringBoolean) {
		return entry && entry === 'on' ? true : false
	}

	function handleAddEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		const form: Partial<Form> = {
			...(props.form ? { ...props.form, id: props.form.id } : {}),
			...formData,
			allow_anonymous_response: handleStringBoolean(formData.allow_anonymous_response),
			allow_multiple_response: handleStringBoolean(formData.allow_multiple_response),
			is_step_form: handleStringBoolean(formData.is_step_form),
			active: handleStringBoolean(formData.active),
		}
		if (!props.form) createForm(form)
		else updateForm(form)
	}

	return (
		<Modal open={props.open} setOpen={props.onClose} title={`Edit Form ${props.form ? `(${props.form.title})` : ''}`}>
			<form className="h-full" onSubmit={handleAddEditForm}>
				<div className="flex h-full max-h-96 flex-grow flex-col gap-4 overflow-y-auto p-4">
					<FormRenderer meta={meta} />
				</div>

				<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
					<Button variant="simple" type="reset">
						Reset
					</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</Modal>
	)
}

export default AddEditForm
