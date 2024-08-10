import { ElementWrapper } from './elementWrapper';
import FormBuilder from '@/components/apps/forms/renderer';
import { FormElementType } from '@/components/apps/forms/renderer/types';
import { Button } from '@/components/lib/button';
import { useFormDesigner } from '@/hooks/formDesigner';
import { SortableContext } from '@dnd-kit/sortable';
import { twMerge } from 'tailwind-merge';

export function FormDesignerCore() {
	const { formBody, viewType, rootProps, setFormDesigner, selectedNode } = useFormDesigner();

	const transformedFormBody: FormElementType[] = formBody.map((item) => ({
		...item,
		render: (WidgetField: any) => (props: any) => (
			<ElementWrapper key={item.id} item={item}>
				<WidgetField {...props} />
			</ElementWrapper>
		),
	}));

	return (
		<form className='flex w-full min-w-80 max-w-[800px] flex-col gap-4'>
			<SortableContext items={formBody}>
				<FormBuilder
					className='flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 shadow-sm'
					formBody={viewType === 'build' ? transformedFormBody : formBody}
				/>
			</SortableContext>

			<div
				onClick={() => setFormDesigner((prev) => ({ ...prev, selectedNode: null }))}
				className={twMerge(
					'flex items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2 shadow-sm',
					selectedNode ? 'bg-gray-100' : 'ring-2 ring-danger'
				)}
			>
				<Button disabled className='select-none' label={rootProps.previousText} variant={viewType === 'build' ? 'disabled' : 'simple'} />
				<Button disabled type='submit' className='select-none' label={rootProps.nextText} variant={viewType === 'build' ? 'disabled' : 'primary'} />
			</div>
		</form>
	);
}
