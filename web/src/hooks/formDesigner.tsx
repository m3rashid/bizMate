import { FormElementInstance, supportedWidgets } from '@components/forms/constants'
import { Props } from '@components/forms/exposedProps'
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { usePopups } from '@hooks/popups'
import { generateRandomString, handleViewTransition } from '@utils/helpers'
import { atom, useRecoilState } from 'recoil'

const propsNodeNotSelected: Props = {
	cancelText: [true, 'Cancel button text', 'string'],
	submitText: [true, 'Submit button text', 'string'],
}

export type FormDesignerType = 'header' | 'body'
export type FormDesigner = {
	rootProps: {
		submitText: string
		cancelText: string
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
			props: { name: 'name', label: 'Name', descriptionText: 'Please enter your full name here' },
		},
	],
	viewType: 'build',
	selectedNode: null,
	rootProps: {
		cancelText: 'Cancel',
		submitText: 'Submit Form',
	},
}

const formDesignerAtom = atom<FormDesigner>({
	key: 'formDesignerAtom',
	default: formDesignerDefaultState,
})

export function useFormDesigner() {
	const { addMessagePopup } = usePopups()
	const [{ meta, viewType, selectedNode, rootProps }, setFormDesigner] = useRecoilState(formDesignerAtom)

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
		if (newNode.name === 'singleSelectInput' || newNode.name === 'radioInput') node.props = { options: [] }
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
		addMessagePopup({ id: nodeKey, message: 'Updated Element', type: 'success' })
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
