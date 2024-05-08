import {
	useState,
	Dispatch,
	useContext,
	createContext,
	SetStateAction,
	PropsWithChildren,
} from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'

import { FormElementInstance, supportedWidgets } from '../components/forms/constants'
import { Props } from '../components/forms/exposedProps'
import { generateRandomString } from '../utils/string'

export type FormDesignerType = 'header' | 'body'
export type FormDesigner = {
	rootClassNames: string
	submitText: string
	cancelText: string
	viewType: 'build' | 'preview'
	meta: FormElementInstance[]
	selectedNode: FormElementInstance | null
}

const formDesignerDefaultState: FormDesigner = {
	meta: [
		{
			id: 'img',
			name: 'image',
			props: {
				src: 'https://via.placeholder.com/150',
				alt: 'placeholder image',
				className: 'w-full h-48 object-cover rounded-md',
			},
		},
	],
	viewType: 'build',
	selectedNode: null,
	cancelText: 'Cancel',
	submitText: 'Submit Form',
	rootClassNames: 'rounded-lg bg-white p-4 shadow-md',
}

const formDesignerContext = createContext<
	[formDesigner: FormDesigner, setFormDesigner: Dispatch<SetStateAction<FormDesigner>>]
>([formDesignerDefaultState, () => {}])

export function FormDesignerProvider({ children }: PropsWithChildren) {
	const [formDesigner, setFormDesigner] = useState<FormDesigner>(formDesignerDefaultState)
	return (
		<formDesignerContext.Provider value={[formDesigner, setFormDesigner]}>
			{children}
		</formDesignerContext.Provider>
	)
}

export function useFormDesigner() {
	const [
		{ meta, viewType, cancelText, submitText, selectedNode, rootClassNames },
		setFormDesigner,
	] = useContext(formDesignerContext)

	function getTaskPosition(meta: FormElementInstance[], id: string | UniqueIdentifier): number {
		return meta.findIndex((el) => el.id === id)
	}

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return
		setFormDesigner((prev) => {
			if (!e.over) return prev
			const source = getTaskPosition(prev.meta, e.active.id)
			const destination = getTaskPosition(prev.meta, e.over.id)
			return {
				...prev,
				meta: arrayMove(prev.meta, source, destination),
			}
		})
	}

	function changeViewType(viewType?: FormDesigner['viewType']) {
		setFormDesigner((prev) => ({
			...prev,
			viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build'),
		}))
	}

	function insertNewNode(newNode: Omit<FormElementInstance, 'id'>) {
		const node: FormElementInstance = { ...newNode, props: {}, id: generateRandomString() }
		setFormDesigner((prev) => ({
			...prev,
			selectedNode: node,
			meta: [...prev.meta, node],
		}))
	}

	function getSelectedNodeProps(): Props {
		if (!selectedNode)
			return {
				// return the props for submit text and cancel text
			}
		return supportedWidgets.find((widget) => widget.name === selectedNode.name)?.props || {}
	}

	function updateNode(nodeKey: string, newNode: FormElementInstance) {}

	function removeNode(nodeKey: string) {
		setFormDesigner((prev) => ({
			...prev,
			meta: prev.meta.filter((node) => node.id !== nodeKey),
		}))
	}

	return {
		meta,
		viewType,
		cancelText,
		submitText,
		removeNode,
		updateNode,
		selectedNode,
		insertNewNode,
		handleDragEnd,
		changeViewType,
		rootClassNames,
		setFormDesigner,
		getSelectedNodeProps,
	}
}
