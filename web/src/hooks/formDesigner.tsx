import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { useState, Dispatch, useContext, createContext, SetStateAction, PropsWithChildren } from 'react'

import { StringBoolean } from '../types'
import { Props } from '../components/forms/exposedProps'
import { generateRandomString, handleViewTransition } from '../utils/helpers'
import { FormElementInstance, supportedWidgets } from '../components/forms/constants'

const propsNodeNotSelected: Props = {
	title: [true, 'Form title', 'string'],
	description: [true, 'Form description', 'textarea'],
	cancelText: [true, 'Cancel button text', 'string'],
	submitText: [true, 'Submit button text', 'string'],
	allowAnonymousResponse: [true, 'Does the user need to be logged in to fill this form?', 'boolean'],
	allowMultipleResponse: [true, 'Do you want the user to respond multiple times to the same form?', 'boolean'],
	allowResponseUpdate: [
		true,
		'Do you want the user to update their responses? Please make sure, If the form is anonymous, this cant be ensured',
		'boolean',
	],
	sendResponseEmail: [
		true,
		'Do you want to send a copy of response to your audience via email? Only applicable if the form is not marked as anonymous ',
		'boolean',
	],
}

export type FormDesignerType = 'header' | 'body'
export type FormDesigner = {
	rootProps: {
		title: string
		submitText: string
		cancelText: string
		description: string
		sendResponseEmail: StringBoolean
		allowResponseUpdate: StringBoolean
		allowMultipleResponse: StringBoolean
		allowAnonymousResponse: StringBoolean
	}
	viewType: 'build' | 'preview'
	meta: FormElementInstance[]
	selectedNode: FormElementInstance | null
}

const formDesignerDefaultState: FormDesigner = {
	meta: [
		{
			id: '$name$',
			name: 'input',
			props: { name: 'name', label: 'Name', required: true, descriptionText: 'Please enter your full name here' },
		},
	],
	viewType: 'build',
	selectedNode: null,
	rootProps: {
		title: 'New Untitled Form',
		cancelText: 'Cancel',
		submitText: 'Submit Form',
		sendResponseEmail: 'off',
		allowAnonymousResponse: 'off',
		description: 'This is a new form',
		allowMultipleResponse: 'off',
		allowResponseUpdate: 'off',
	},
}

const formDesignerContext = createContext<[formDesigner: FormDesigner, setFormDesigner: Dispatch<SetStateAction<FormDesigner>>]>([
	formDesignerDefaultState,
	() => {},
])

export function FormDesignerProvider(props: PropsWithChildren) {
	const [formDesigner, setFormDesigner] = useState<FormDesigner>(formDesignerDefaultState)
	return <formDesignerContext.Provider value={[formDesigner, setFormDesigner]}>{props.children}</formDesignerContext.Provider>
}

export function useFormDesigner() {
	const [{ meta, viewType, selectedNode, rootProps }, setFormDesigner] = useContext(formDesignerContext)

	function getTaskPosition(meta: FormElementInstance[], id: string | UniqueIdentifier): number {
		return meta.findIndex((el) => el.id === id)
	}

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return
		handleViewTransition(() =>
			setFormDesigner((prev) => {
				if (!e.over) return prev
				const source = getTaskPosition(prev.meta, e.active.id)
				const destination = getTaskPosition(prev.meta, e.over.id)
				return { ...prev, meta: arrayMove(prev.meta, source, destination) }
			}),
		)
	}

	function changeViewType(viewType?: FormDesigner['viewType']) {
		handleViewTransition(() => setFormDesigner((prev) => ({ ...prev, viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build') })))
	}

	function insertNewNode(newNode: Omit<FormElementInstance, 'id'>) {
		const node: FormElementInstance = { ...newNode, props: {}, id: generateRandomString() }
		if (newNode.name === 'singleSelectInput') node.props = { options: [] }
		handleViewTransition(() => setFormDesigner((prev) => ({ ...prev, selectedNode: node, meta: [...prev.meta, node] })))
	}

	function getSelectedNodeProps(): { _props: Props; values: Record<string, any> } {
		if (!selectedNode) return { values: rootProps, _props: propsNodeNotSelected }
		return {
			values: meta.find((node) => node.id === selectedNode.id)?.props || {},
			_props: supportedWidgets.find((widget) => widget.name === selectedNode.name)?.props || {},
		}
	}

	function updateNode(nodeKey: string, props: Props) {
		handleViewTransition(() =>
			setFormDesigner((prev) => ({ ...prev, meta: prev.meta.map((node) => ({ ...node, props: node.id === nodeKey ? props : node.props })) })),
		)
	}

	function removeNode(nodeKey: string) {
		handleViewTransition(() => setFormDesigner((prev) => ({ ...prev, selectedNode: null, meta: prev.meta.filter((node) => node.id !== nodeKey) })))
	}

	return {
		meta,
		viewType,
		rootProps,
		removeNode,
		updateNode,
		selectedNode,
		insertNewNode,
		handleDragEnd,
		changeViewType,
		setFormDesigner,
		getSelectedNodeProps,
	}
}
