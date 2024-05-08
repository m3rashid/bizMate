import { FormEvent, MouseEvent, useMemo, useRef } from 'react'

import Button from '../lib/button'
import { Props } from '../forms/exposedProps'
import FormRenderer from '../forms/renderer'
import { FormElementInstance } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'
import { camelCaseToSentenceCase, generateRandomString } from '../../utils/string'

function propsToMeta(_props: Props): FormElementInstance[] {
	const meta: FormElementInstance[] = []

	const props = Object.entries(_props)
	for (let i = 0; i < props.length; i++) {
		const [key, value] = props[i]
		const id = generateRandomString()
		if (value === 'string') {
			meta.push({
				id,
				name: 'textInput',
				props: { name: key, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'textarea') {
			meta.push({
				id,
				name: 'textareaInput',
				props: { name: key, label: camelCaseToSentenceCase(key) },
			})
		} else if (value === 'number') {
			meta.push({
				id,
				name: 'textInput',
				props: { name: key, label: camelCaseToSentenceCase(key), type: 'number' },
			})
		} else if (value === 'boolean') {
		} else if (value === 'children') {
		} else if (Array.isArray(value)) {
		}
	}

	return meta
}

function RightSidebar() {
	const { selectedNode, getSelectedNodeProps, setFormDesigner } = useFormDesigner()

	const formRef = useRef<HTMLFormElement>(null)
	const meta = useMemo(() => propsToMeta(getSelectedNodeProps()), [selectedNode])

	function handleReset(e: MouseEvent<HTMLButtonElement>) {
		e.stopPropagation()
		e.preventDefault()
		formRef.current?.reset()
	}

	function handleSave(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (selectedNode) {
			// item props are getting updated here
			setFormDesigner((prev) => {
				return {
					...prev,
					meta: prev.meta.map((el) =>
						el.id === prev.selectedNode?.id ? { ...el, props: { ...formData } } : el,
					),
				}
			})
		} else {
			// cancel Text and Submit text are updated here
		}
		formRef.current?.reset()
	}

	return (
		<form ref={formRef} className="flex h-full flex-col gap-4" onSubmit={handleSave}>
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
	)
}

export default RightSidebar
