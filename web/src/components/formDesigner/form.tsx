import { twMerge } from 'tailwind-merge'
import { SortableContext } from '@dnd-kit/sortable'

import FormBuilder from '../forms'
import Button from '../lib/button'
import ElementWrapper from './elementWrapper'
import { FormElementInstance } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'

function SingleFormDesigner() {
	const { meta, viewType, rootProps, setFormDesigner, selectedNode } = useFormDesigner()

	const transformedMeta: FormElementInstance[] = meta.map((item) => ({
		...item,
		render: (WidgetField: any) => (props: any) => (
			<ElementWrapper key={item.id} item={item}>
				<WidgetField {...props} />
			</ElementWrapper>
		),
	}))

	return (
		<form className="flex w-full min-w-80 max-w-[800px] flex-col gap-4">
			<SortableContext items={meta}>
				<FormBuilder
					className="flex flex-col gap-4 rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md"
					meta={viewType === 'build' ? transformedMeta : meta}
				/>
			</SortableContext>

			<div
				onClick={() => setFormDesigner((prev) => ({ ...prev, selectedNode: null }))}
				className={twMerge(
					'flex items-center justify-between rounded-lg border-[1px] border-gray-200 bg-white p-4 shadow-md',
					selectedNode ? 'bg-gray-200' : 'ring-2 ring-linkActive',
				)}
			>
				<Button disabled className="select-none" label={rootProps.cancelText} variant={viewType === 'build' ? 'disabled' : 'simple'} />
				<Button disabled type="submit" className="select-none" label={rootProps.submitText} variant={viewType === 'build' ? 'disabled' : 'primary'} />
			</div>
		</form>
	)
}

export default SingleFormDesigner
