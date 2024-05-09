import { FormEvent, MouseEvent, useMemo, useRef } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

import Button from '../lib/button'
import Tooltip from '../lib/tooltip'
import FormRenderer from '../forms/renderer'
import { Props } from '../forms/exposedProps'
import { FormElementInstance } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'
import { camelCaseToSentenceCase, generateRandomString } from '../../utils/helpers'

type PropsToMetaProps = { props: Props; values: Record<string, any> }
function propsToMeta({ props: _props, values }: PropsToMetaProps): FormElementInstance[] {
	const meta: FormElementInstance[] = []

	const props = Object.entries(_props)
	for (let i = 0; i < props.length; i++) {
		const [key, [description, value]] = props[i]
		const id = generateRandomString()
		if (value === 'string') {
			meta.push({
				id,
				name: 'textInput',
				props: {
					name: key,
					defaultValue: values[key],
					descriptionText: description,
					label: camelCaseToSentenceCase(key),
				},
			})
		} else if (value === 'textarea') {
			meta.push({
				id,
				name: 'textareaInput',
				props: {
					name: key,
					defaultValue: values[key],
					descriptionText: description,
					label: camelCaseToSentenceCase(key),
				},
			})
		} else if (value === 'number') {
			meta.push({
				id,
				name: 'textInput',
				props: {
					name: key,
					type: 'number',
					defaultValue: values[key],
					descriptionText: description,
					label: camelCaseToSentenceCase(key),
				},
			})
		} else if (value === 'boolean') {
		} else if (value === 'children') {
		} else if (Array.isArray(value)) {
		}
	}
	return meta
}

function RightSidebar() {
	const { selectedNode, getSelectedNodeProps, updateNode } = useFormDesigner()

	const formRef = useRef<HTMLFormElement>(null)
	const meta = useMemo(() => propsToMeta(getSelectedNodeProps()), [selectedNode])

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		e.preventDefault()
		formRef.current?.reset()
		if (!selectedNode) return
		updateNode(selectedNode.id, {})
	}

	function handleSave(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (selectedNode) {
			// item props are getting updated here
			updateNode(selectedNode.id, formData)
		} else {
			// cancel Text and Submit text are updated here
		}
	}

	return (
		<div className="min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-4 shadow-lg">
			<form ref={formRef} className="flex h-full flex-col gap-4" onSubmit={handleSave}>
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-semibold">
						{selectedNode
							? `Settings for ${camelCaseToSentenceCase(selectedNode.name)}`
							: `Overall Form Settings`}
					</h2>
					<Tooltip
						label={selectedNode ? `Properties of the selected element: ${selectedNode.name}` : ''}
					>
						<InformationCircleIcon className="h-6 w-6" />
					</Tooltip>
				</div>

				{selectedNode ? (
					<div className="flex h-full flex-grow flex-col gap-4 overflow-y-auto">
						<FormRenderer meta={meta} />
					</div>
				) : null}

				{selectedNode ? (
					<div className="flex flex-grow-0 items-center justify-between border-t-2 pt-3">
						<Button type="submit">Save</Button>
						<Button variant="simple" onClick={handleReset}>
							Reset
						</Button>
					</div>
				) : null}
			</form>
		</div>
	)
}

export default RightSidebar
