import { useMutation } from '@tanstack/react-query'
import { Dispatch, FormEvent, SetStateAction, useMemo } from 'react'

import Modal from '../../lib/modal'
import Button from '../../lib/button'
import apiClient from '../../../api/client'
import FormRenderer from '../../forms/renderer'
import { Form, StringBoolean } from '../../../types'
import { FormElementInstance, SupportedWidgetName } from '../../forms/constants'
import { camelCaseToSentenceCase, handleViewTransition } from '../../../utils/helpers'

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
	const { mutate } = useMutation({
		mutationKey: ['editForm'],
		mutationFn: (form: Partial<Form>) => apiClient('/forms/update', { method: 'POST', body: JSON.stringify(form) }),
		onSuccess: () => {
			props.setOpen(false)
			if (props.form) props.refetch()
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
			<form className="flex h-full flex-col gap-4" onSubmit={handleEditForm}>
				<div className="flex h-full max-h-96 flex-grow flex-col gap-4 overflow-y-auto p-4">
					<FormRenderer meta={meta} />
				</div>

				<div className="flex flex-grow-0 items-center justify-between p-4">
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
