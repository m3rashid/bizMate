import { EditorRef } from 'react-email-editor'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { FormEvent, MouseEvent, RefObject, useState } from 'react'

import Modal from '../lib/modal'
import Button from '../lib/button'
import Input from '../lib/input'
import apiClient from '../../api/client'
import { usePopups } from '../../hooks/popups'
import TextAreaInput from '../lib/textAreaInput'

type EmailEditorTopBarProps = { emailEditorRef: RefObject<EditorRef> }
type EmailBody = { title: string; description: string; subjectTemplate: string }

function EmailEditorTopBar(props: EmailEditorTopBarProps) {
	const navigate = useNavigate({ from: '/apps/communications/emails/designer' })
	const { addMessagePopup, addActionPopup, removeActionPopup } = usePopups()
	const [open, setOpen] = useState(false)
	const [emailBody, setEmailBody] = useState<EmailBody>({ title: '', description: '', subjectTemplate: '' })

	const { mutate: createEmailTemplate } = useMutation({
		onSuccess: () => {
			addMessagePopup({ id: 'createEmailTemplateSuccess', message: 'Successfully Created Email Template', type: 'success' })
			navigate({ to: '/apps/communications/emails/templates' })
		},
		onError: () => addMessagePopup({ id: 'createEmailTemplateSuccess', message: 'Email Template creation failed', type: 'error' }),
		mutationKey: ['createEmailTemplate'],
		mutationFn: (data: EmailBody & { bodyTemplateHtml: string; bodyTemplateDesignJson: string }) =>
			apiClient('/email-templates/create', { method: 'POST', body: JSON.stringify(data) }),
	})

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
	}

	function handleAddTemplateDetails(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.title || !formData.subjectTemplate) {
			addMessagePopup({ type: 'error', id: 'formDataInvalid', message: 'Missing Required Fields' })
			return
		}
		setEmailBody({ description: formData.description, subjectTemplate: formData.subjectTemplate, title: formData.title })
		setOpen(false)
	}

	function handleSaveTemplate() {
		const popupId = 'areYousureSaveTemplate'
		const onFail = () => removeActionPopup(popupId)
		function onSuccess() {
			removeActionPopup(popupId)
			exportHtml()
		}

		addActionPopup({
			id: popupId,
			type: 'info',
			title: 'Are you sure ?',
			children: (
				<>
					<div className="text-sm">Are you sure this template is complete ?, once saved, it cannot be edited</div>
					<div className="mt-4 flex items-center justify-between">
						<Button variant="simple" size="small" onClick={onFail}>
							Close
						</Button>
						<Button size="small" variant="sucess" onClick={onSuccess}>
							Yes, I am sure
						</Button>
					</div>
				</>
			),
		})
	}

	function exportHtml() {
		const unlayer = props.emailEditorRef.current?.editor

		unlayer?.exportHtml((data) => {
			const { design, html } = data
			if (!emailBody.title || !emailBody.subjectTemplate) {
				addMessagePopup({ type: 'error', id: 'formDataInvalid', message: 'Missing Required Fields' })
				setOpen(true)
				return
			}

			try {
				JSON.parse(JSON.stringify(design))
			} catch (err) {
				addMessagePopup({ id: 'notJsonParsable', message: 'Unknown Error Occured', type: 'error' })
				return
			}

			createEmailTemplate({ ...emailBody, bodyTemplateHtml: html, bodyTemplateDesignJson: JSON.stringify(design) })
		})
	}

	if (!props.emailEditorRef.current) return null
	return (
		<div className="mb-2 flex items-center justify-start gap-4">
			<Button size="small" onClick={handleSaveTemplate}>
				Save Template
			</Button>

			<Button size="small" onClick={() => setOpen(true)}>
				Add Other Template Details
			</Button>

			<Modal {...{ open, setOpen, title: 'Email Template Details' }}>
				<form className="flex h-full flex-col gap-4" onSubmit={handleAddTemplateDetails}>
					<Input name="title" label="Template Name" required defaultValue={emailBody.title} />
					<TextAreaInput name="description" label="Description" defaultValue={emailBody.description} />
					<TextAreaInput name="subjectTemplate" label="Template Subject Template" required defaultValue={emailBody.subjectTemplate} />

					<div className="flex flex-grow-0 items-center justify-between pt-3">
						<Button variant="simple" onClick={handleReset}>
							Reset
						</Button>
						<Button type="submit">Save</Button>
					</div>
				</form>
			</Modal>
		</div>
	)
}

export default EmailEditorTopBar
