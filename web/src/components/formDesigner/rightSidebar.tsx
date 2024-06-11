import { FormEvent, MouseEvent, useMemo, useRef } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

import Button from '../lib/button'
import Tooltip from '../lib/tooltip'
import FormRenderer from '../forms/renderer'
import { Props } from '../forms/exposedProps'
import { FormElementInstance } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'
import { camelCaseToSentenceCase, generateRandomString } from '../../utils/helpers'

type PropsToMetaProps = { _props: Props; values: Record<string, any> }
function propsToMeta({ _props, values }: PropsToMetaProps): FormElementInstance[] {
	const meta: FormElementInstance[] = []

	const props = Object.entries(_props)
	for (let i = 0; i < props.length; i++) {
		const [key, [description, value]] = props[i]
		const id = generateRandomString()
		if (value === 'string') {
			meta.push({
				id,
				name: 'textInput',
				props: { name: key, defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'textarea') {
			meta.push({
				id,
				name: 'textareaInput',
				props: { name: key, defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'richText') {
			meta.push({
				id,
				name: 'richTextInput',
				props: { name: key, defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'number') {
			meta.push({
				id,
				name: 'textInput',
				props: { name: key, type: 'number', defaultValue: values[key], descriptionText: description, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'boolean') {
			meta.push({
				id,
				name: 'togglerInput',
				props: {
					name: key,
					descriptionText: description,
					label: camelCaseToSentenceCase(key),
					defaultValue: values[key] ? values[key] : 'off',
					defaultChecked: values[key] ? values[key] === 'on' : false,
				},
			})
		} else if (value === 'children') {
		} else if (Array.isArray(value)) {
		}
	}
	return meta
}

function RightSidebar() {
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
		if (selectedNode) updateNode(selectedNode.id, formData)
		else {
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
		<div className="w-full min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-4 shadow-lg">
			<form ref={formRef} className="flex h-full flex-col gap-4" onSubmit={handleSave}>
				<div className="flex items-center justify-between gap-2 border-b-2 border-b-gray-200 pb-3">
					<h2 className="text-xl font-semibold">{selectedNode ? `Settings for ${camelCaseToSentenceCase(selectedNode.name)}` : 'Form Settings'}</h2>
					{selectedNode ? (
						<Tooltip show="left" label={selectedNode ? `Properties of the selected element: ${selectedNode.name}` : ''}>
							<InformationCircleIcon className="h-6 w-6" />
						</Tooltip>
					) : null}
				</div>

				<div className="flex h-full flex-grow flex-col gap-4 overflow-y-auto">
					<FormRenderer meta={meta} />
				</div>

				<div className="flex flex-grow-0 items-center justify-between border-t-2 pt-3">
					<Button type="submit">Save</Button>
					<Button variant="simple" onClick={handleReset}>
						Reset
					</Button>
				</div>
			</form>
		</div>
	)
}

export default RightSidebar
