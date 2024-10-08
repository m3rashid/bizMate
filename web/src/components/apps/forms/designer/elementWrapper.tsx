import { FormElementType } from '@/components/apps/forms/renderer/types';
import { Tooltip } from '@/components/lib/tooltip';
import { useFormDesigner } from '@/hooks/formDesigner';
import { cn } from '@/utils/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import XMarkIcon from '@heroicons/react/20/solid/XMarkIcon';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export type ElementWrapperProps = PropsWithChildren & {
	item: FormElementType;
};

export function ElementWrapper(props: ElementWrapperProps) {
	const { t } = useTranslation();
	const { removeNode, setFormDesigner, selectedNode } = useFormDesigner();
	const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id: props.item.id });

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={cn(
				'relative my-2 rounded-md border-2 border-gray-200 px-3 py-2',
				selectedNode?.id === props.item.id ? 'ring-2 ring-danger' : 'bg-gray-100',
				isDragging ? 'cursor-grab' : ''
			)}
			onClick={() => setFormDesigner((prev) => ({ ...prev, selectedNode: props.item }))}
			style={{ transition, transform: CSS.Transform.toString(transform), viewTransitionName: `form-wrapper-${props.item.id}` }}
		>
			{props.children}
			<div
				className='absolute -right-3 -top-3 z-10 rounded-full border border-borderColor bg-white p-1 hover:border-0 hover:bg-danger hover:text-white'
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					removeNode(props.item.id);
				}}
			>
				<Tooltip position='right' label={t('Double Click to remove')}>
					<XMarkIcon className='-mr-0.5 h-6 w-6' />
				</Tooltip>
			</div>
		</div>
	);
}
