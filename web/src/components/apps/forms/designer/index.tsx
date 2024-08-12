'use client';

import { apiClient } from '@/api/config';
import { queryKeys } from '@/api/queryKeys';
import { FormDesignerCore } from '@/components/apps/forms/designer/designerCore';
import { FormWidgetItem } from '@/components/apps/forms/designer/formWidgetItem';
import { RightSidebar } from '@/components/apps/forms/designer/rightSidebar';
import { FormDesignerTopBar } from '@/components/apps/forms/designer/topBar';
import { supportedWidgets } from '@/components/apps/forms/renderer/constants';
import { PageLoader } from '@/components/lib/loaders';
import { useFormDesigner } from '@/hooks/formDesigner';
import { ApiResponse, Form } from '@/utils/types';
import { closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import FaceFrownIcon from '@heroicons/react/24/outline/FaceFrownIcon';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export type FormDesignerComponentProps = {
	formId: string;
	workspaceId: string;
};
export function FormDesignerComponent(props: FormDesignerComponentProps) {
	const { data: formRes, isPending } = useQuery({
		queryKey: [queryKeys.singleForm],
		queryFn: () => apiClient<ApiResponse<Form>>(`/${props.workspaceId}/forms/one/${props.formId}`),
	});

	if (isPending) return <PageLoader />;
	if (!formRes) {
		return (
			<div className='flex h-full items-center justify-center'>
				<div className='flex flex-col items-center'>
					<FaceFrownIcon className='h-10 w-10 text-gray-500' />
					<p className='text-gray-500'>Unable to fetch form data</p>
				</div>
			</div>
		);
	}

	return <FormDesignerComponentInner {...formRes.data} />;
}

export function FormDesignerComponentInner(form: Form) {
	const { handleDragEnd, __setInitialFormBody } = useFormDesigner();

	useEffect(() => {
		__setInitialFormBody(form.form_body, form.cancel_text, form.submit_text);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
					<FormDesignerTopBar workspaceId={form.workspace_id} formId={form.id} />
					<FormDesignerCore />
				</div>

				<RightSidebar />
			</div>
		</DndContext>
	);
}
