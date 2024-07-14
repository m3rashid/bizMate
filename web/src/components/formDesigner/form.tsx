import ElementWrapper from '@components/formDesigner/elementWrapper'
import FormBuilder from '@components/forms'
import { FormElementInstance } from '@components/forms/constants'
import Button from '@components/lib/button'
import { SortableContext } from '@dnd-kit/sortable'
import { useFormDesigner } from '@hooks/formDesigner'
import { twMerge } from 'tailwind-merge'

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
					className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 shadow-sm"
					meta={viewType === 'build' ? transformedMeta : meta}
				/>
			</SortableContext>

			<div
				onClick={() => setFormDesigner((prev) => ({ ...prev, selectedNode: null }))}
				className={twMerge(
					'flex items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2 shadow-sm',
					selectedNode ? 'bg-gray-100' : 'ring-2 ring-danger',
				)}
			>
				<Button disabled className="select-none" label={rootProps.previousText} variant={viewType === 'build' ? 'disabled' : 'simple'} />
				<Button disabled type="submit" className="select-none" label={rootProps.nextText} variant={viewType === 'build' ? 'disabled' : 'primary'} />
			</div>
		</form>
	)
}

export default SingleFormDesigner
