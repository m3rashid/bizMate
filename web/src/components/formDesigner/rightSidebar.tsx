import { useFormDesigner } from '../../hooks/formDesigner'
import { usePopups } from '../../hooks/popups'
import { camelCaseToSentenceCase, generateRandomString } from '../../utils/helpers'
import { FormElementInstance } from '../forms/constants'
import { Props } from '../forms/exposedProps'
import FormRenderer from '../forms/renderer'
import Button from '../lib/button'
import { FormEvent, MouseEvent, useMemo, useRef } from 'react'

type PropsToMetaProps = { _props: Props; values: Record<string, any> }
function propsToMeta({ _props, values }: PropsToMetaProps): FormElementInstance[] {
	const meta: FormElementInstance[] = []

	const props = Object.entries(_props)
	for (let i = 0; i < props.length; i++) {
		const [key, [required, description, value]] = props[i]
		const id = generateRandomString()
		if (value === 'string') {
			meta.push({
				id,
				name: 'input',
				props: { required, name: key, defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'textarea') {
			meta.push({
				id,
				name: 'textareaInput',
				props: { required, name: key, defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'number') {
			meta.push({
				id,
				name: 'input',
				props: { required, name: key, type: 'number', defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'boolean') {
			meta.push({
				id,
				name: 'togglerInput',
				props: {
					required,
					name: key,
					descriptionText: description,
					label: camelCaseToSentenceCase(key),
					defaultValue: values[key] ? values[key] : 'off',
					defaultChecked: values[key] ? values[key] === 'on' : false,
				},
			})
		} else if (value === 'richText') {
			meta.push({
				id,
				name: 'richTextInput',
				props: { required, name: key, defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (Array.isArray(value)) {
			meta.push({
				id,
				name: 'singleSelectInput',
				props: {
					required,
					name: key,
					defaultValue: values[key],
					descriptionText: description,
					label: camelCaseToSentenceCase(key),
					options: value.map((t) => (typeof t === 'string' ? { name: key, value: t, label: camelCaseToSentenceCase(t) } : t)),
				},
			})
		} else if (value === 'selectOptions') {
			meta.push({ id, name: 'selectListInput', props: { name: 'options', required: true } })
		} else if (value === 'children') {
		}
	}
	return meta
}

function RightSidebar() {
	const { addMessagePopup } = usePopups()
	const { selectedNode, getSelectedNodeProps, updateNode, setFormDesigner } = useFormDesigner()

	const formRef = useRef<HTMLFormElement>(null)
	const meta = useMemo(() => propsToMeta(getSelectedNodeProps()), [selectedNode])

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		e.preventDefault()
		formRef.current?.reset()
		if (selectedNode) updateNode(selectedNode.id, {})
		else setFormDesigner((prev) => ({ ...prev, cancelText: 'Cancel', submitText: 'Submit Form' }))
	}

	function handleSave(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (selectedNode) {
			let options: string[] = []
			if (selectedNode.name === 'singleSelectInput' || selectedNode.name === 'radioInput') {
				try {
					options = JSON.parse(formData.options)
				} catch (err) {
					options = []
				}
				formData.options = options
			}

			updateNode(selectedNode.id, { ...formData, ...(formData.shuffle ? { shuffle: formData.shuffle === 'on' } : {}) })
		} else {
			addMessagePopup({ id: 'formSettingsUpdated', message: 'Form Settings updated', type: 'success' })
			setFormDesigner((prev) => ({
				...prev,
				rootProps: {
					title: formData.title,
					cancelText: formData.cancelText,
					submitText: formData.submitText,
					description: formData.description,
					sendResponseEmail: formData.sendResponseEmail,
					allowResponseUpdate: formData.allowResponseUpdate,
					allowMultipleResponse: formData.allowMultipleResponse,
					allowAnonymousResponse: formData.allowAnonymousResponse,
				},
			}))
		}
	}

	return (
		<div className="w-full min-w-80 max-w-96 bg-gray-100 shadow-sm">
			<form ref={formRef} className="flex h-full flex-col" onSubmit={handleSave}>
				<div className="flex items-center justify-between gap-2 border-b-2 border-b-gray-200 px-4 py-2.5">
					<h2 className="text-lg font-semibold">{selectedNode ? 'Element settings' : 'Form Settings'}</h2>
					<div className="flex items-center gap-2">
						<Button size="small" type="submit" className="py-1">
							Save
						</Button>
						<Button size="small" variant="simple" onClick={handleReset} className="py-1">
							Reset
						</Button>
					</div>
				</div>

				<div className="flex h-full max-h-[calc(100vh-100px)] flex-grow flex-col gap-4 overflow-y-auto p-4">
					<FormRenderer meta={meta} />
				</div>
			</form>
		</div>
	)
}

export default RightSidebar
