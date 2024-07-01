import apiClient from '@api/client'
import { FormElementInstance, SupportedWidgetName } from '@components/forms/constants'
import FormRenderer from '@components/forms/renderer'
import Button from '@components/lib/button'
import Modal from '@components/lib/modal'
import { usePopups } from '@hooks/popups'
import { Form, StringBoolean } from '@mytypes'
import { useMutation } from '@tanstack/react-query'
import { camelCaseToSentenceCase, handleViewTransition } from '@utils/helpers'
import { Dispatch, FormEvent, SetStateAction, useMemo } from 'react'

export type EditFormProps = { setOpen: Dispatch<SetStateAction<boolean>> } & ({ form: undefined } | { form: Form; refetch: () => void })

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

function EditForm(props: EditFormProps) {
	const { addMessagePopup } = usePopups()
	const { mutate } = useMutation({
		mutationKey: ['editForm'],
		mutationFn: (form: Partial<Form>) => apiClient('/forms/update', { method: 'POST', body: JSON.stringify(form) }),
		onSuccess: () => {
			props.setOpen(false)
			addMessagePopup({ id: 'successUpdatingForm', message: 'Form updated successfully', type: 'success' })
			if (props.form) props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'errorUpdatingForm', message: 'An Error occured in updating form', type: 'error' })
		},
	})

	const meta = useMemo(() => {
		if (!props.form) return []
		return editFormMeta([
			['title', props.form.title, 'Form title', 'input', true],
			['description', props.form.description, 'Form description', 'textareaInput'],
			['cancelText', props.form.cancelText, 'Cancel button text', 'input', true],
			['submitText', props.form.submitText, 'Submit button text', 'input', true],
			[
				'allowAnonymousResponse',
				props.form.allowAnonymousResponse ? 'on' : 'off',
				'Does the user need to be logged in to fill this form',
				'togglerInput',
				true,
				{ defaultChecked: props.form.allowAnonymousResponse },
			],
			[
				'allowMultipleResponse',
				props.form.allowMultipleResponse ? 'on' : 'off',
				'Can the user submit multiple responses',
				'togglerInput',
				true,
				{ defaultChecked: props.form.allowMultipleResponse },
			],
			[
				'allowResponseUpdate',
				props.form.allowResponseUpdate ? 'on' : 'off',
				'Can the user update their response',
				'togglerInput',
				true,
				{ defaultChecked: props.form.allowResponseUpdate },
			],
			['active', props.form.active ? 'on' : 'off', 'Is this form active', 'togglerInput', true, { defaultChecked: props.form.active }],
		])
	}, [props.form?.id])

	function handleStringBoolean(entry?: StringBoolean) {
		return entry && entry === 'on' ? true : false
	}

	function handleEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!props.form) return

		const form: Partial<Form> = {
			...props.form,
			...formData,
			id: props.form.id,
			allowAnonymousResponse: handleStringBoolean(formData.allowAnonymousResponse),
			allowMultipleResponse: handleStringBoolean(formData.allowMultipleResponse),
			allowResponseUpdate: handleStringBoolean(formData.allowResponseUpdate),
			active: handleStringBoolean(formData.active),
		}
		mutate(form)
	}

	return (
		<Modal
			open={!!props.form}
			setOpen={() => handleViewTransition(() => props.setOpen(false))}
			title={`Edit Form ${props.form ? `(${props.form.title})` : ''}`}
		>
			<form className="h-full" onSubmit={handleEditForm}>
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

export default EditForm
