'use client';

import { FormDesignerCore } from '@/components/apps/forms/designer/designerCore';
import { FormWidgetItem } from '@/components/apps/forms/designer/formWidgetItem';
import { RightSidebar } from '@/components/apps/forms/designer/rightSidebar';
import { FormDesignerTopBar } from '@/components/apps/forms/designer/topBar';
import { supportedWidgets } from '@/components/apps/forms/renderer/constants';
import { useFormDesigner } from '@/hooks/formDesigner';
import { Form } from '@/utils/types';
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function FormDesignerComponent(props: { form: Form }) {
	const { handleDragEnd } = useFormDesigner();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
			<div className='flex h-full'>
				<div className='min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-3 drop-shadow-sm'>
					<div className='grid grid-cols-2 gap-3'>
						{supportedWidgets.map((widgetConfig) => (
							<FormWidgetItem key={widgetConfig.name} {...widgetConfig} />
						))}
					</div>
				</div>

				<div className='flex w-full flex-col items-center overflow-auto bg-white p-4 pb-10'>
					<FormDesignerTopBar workspaceId={props.form.workspace_id} formId={props.form.id} />
					<FormDesignerCore />
				</div>

				<RightSidebar />
			</div>
		</DndContext>
	);
}
