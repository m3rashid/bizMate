import { supportedWidgets } from '@/components/apps/forms/renderer/constants';
import { FormElementType, Props } from '@/components/apps/forms/renderer/types';
import { usePopups } from '@/hooks/popups';
import { generateRandomString } from '@/utils/helpers';
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { atom, useRecoilState } from 'recoil';

const propsNodeNotSelected: Props = {
	previousText: [true, 'Previous button text', 'string'],
	nextText: [true, 'Next button text', 'string'],
};

export type FormDesignerType = 'header' | 'body';
export type FormDesigner = {
	rootProps: {
		nextText: string;
		previousText: string;
	};
	viewType: 'build' | 'preview';
	formBody: FormElementType[];
	selectedNode: FormElementType | null;
};

const formDesignerDefaultState: FormDesigner = {
	formBody: [
		{
			id: '$name$',
			name: 'input',
			props: { name: 'name', label: 'Name', descriptionText: 'Please enter your full name here' },
		},
	],
	viewType: 'build',
	selectedNode: null,
	rootProps: {
		previousText: 'Back',
		nextText: 'Next',
	},
};

const formDesignerAtom = atom<FormDesigner>({
	key: 'formDesignerAtom',
	default: formDesignerDefaultState,
});

export function useFormDesigner() {
	const { addMessagePopup } = usePopups();
	const [{ formBody, viewType, selectedNode, rootProps }, setFormDesigner] = useRecoilState(formDesignerAtom);

	function getTaskPosition(formBody: FormElementType[], id: string | UniqueIdentifier): number {
		return formBody.findIndex((el) => el.id === id);
	}

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return;
		setFormDesigner((prev) => {
			if (!e.over) return prev;
			const source = getTaskPosition(prev.formBody, e.active.id);
			const destination = getTaskPosition(prev.formBody, e.over.id);
			return { ...prev, formBody: arrayMove(prev.formBody, source, destination) };
		});
	}

	function changeViewType(viewType?: FormDesigner['viewType']) {
		setFormDesigner((prev) => ({ ...prev, viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build') }));
	}

	function insertNewNode(newNode: Omit<FormElementType, 'id'>) {
		const node: FormElementType = { ...newNode, props: {}, id: generateRandomString() };
		if (newNode.name === 'singleSelectInput' || newNode.name === 'radioInput') node.props = { options: [] };
		setFormDesigner((prev) => ({ ...prev, selectedNode: node, formBody: [...prev.formBody, node] }));
	}

	function getSelectedNodeProps(): { _props: Props; values: Record<string, any> } {
		if (!selectedNode) return { values: rootProps, _props: propsNodeNotSelected };
		return {
			values: formBody.find((node) => node.id === selectedNode.id)?.props || {},
			_props: supportedWidgets.find((widget) => widget.name === selectedNode.name)?.props || {},
		};
	}

	function updateNode(nodeKey: string, props: Props) {
		addMessagePopup({ id: nodeKey, message: 'Updated Element', type: 'success' });
		setFormDesigner((prev) => ({ ...prev, formBody: prev.formBody.map((node) => ({ ...node, props: node.id === nodeKey ? props : node.props })) }));
	}

	function removeNode(nodeKey: string) {
		setFormDesigner((prev) => ({ ...prev, selectedNode: null, formBody: prev.formBody.filter((node) => node.id !== nodeKey) }));
	}

	return {
		formBody,
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
	};
}
