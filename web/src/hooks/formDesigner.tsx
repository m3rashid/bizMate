import { supportedWidgets } from '@/components/apps/forms/renderer/constants';
import { FormElementType, Props } from '@/components/apps/forms/renderer/types';
import { generateRandomString } from '@/utils/helpers';
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { atom, useRecoilState } from 'recoil';
import { toast } from 'sonner';

const propsNodeNotSelected: Props = {
	cancelText: [true, 'Text on cancel button', 'string'],
	submitText: [true, 'Text on submit button', 'string'],
};

export type FormDesignerType = 'header' | 'body';
export type FormDesigner = {
	rootProps: {
		submitText: string;
		cancelText: string;
	};
	viewType: 'build' | 'preview';
	formBody: FormElementType[];
	selectedNode: FormElementType | null;
};

const formDesignerDefaultState: FormDesigner = {
	formBody: [],
	viewType: 'build',
	selectedNode: null,
	rootProps: {
		cancelText: 'Back',
		submitText: 'Next',
	},
};

const defaultFormDesignerFormBody: FormElementType[] = [
	{
		id: '$name$',
		name: 'input',
		props: { name: 'name', label: 'Name', descriptionText: 'Please enter your full name here' },
	},
];

const formDesignerAtom = atom<FormDesigner>({
	key: 'formDesignerAtom',
	default: formDesignerDefaultState,
});

export function useFormDesigner() {
	const [{ formBody, viewType, selectedNode, rootProps }, setFormDesigner] = useRecoilState(formDesignerAtom);

	function __setInitialFormBody(formBody: FormElementType[], cancelText: string, submitText: string) {
		if (formBody.length !== 0) {
			setFormDesigner((prev) => ({
				...prev,
				formBody: prev.formBody.length === 0 ? formBody : prev.formBody,
				rootProps: { cancelText, submitText },
			}));
		} else {
			setFormDesigner((prev) => ({
				...prev,
				formBody: prev.formBody.length === 0 ? defaultFormDesignerFormBody : prev.formBody,
				rootProps: { cancelText, submitText },
			}));
		}
	}

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
		toast.success('Updated Element');
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
		__setInitialFormBody,
		getSelectedNodeProps,
	};
}
