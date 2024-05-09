import { twMerge } from 'tailwind-merge'
import { FormEvent, MouseEvent } from 'react'
import { SortableContext } from '@dnd-kit/sortable'

import FormBuilder from '../forms'
import Button from '../lib/button'
import ElementWrapper from './elementWrapper'
import { FormElementInstance } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'

function SingleFormDesigner() {
	const { meta, rootClassNames, viewType, cancelText, submitText } = useFormDesigner()

	const transformedMeta: FormElementInstance[] = meta.map((item) => ({
		...item,
		render: (WidgetField: any) => (props: any) => (
			<ElementWrapper key={item.id} item={item}>
				<WidgetField {...props} />
			</ElementWrapper>
		),
	}))

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log({ formData })
	}

	function handleCancel(e: MouseEvent<HTMLButtonElement>) {
		e.preventDefault()
		const form = (e.target as any).parentNode.parentNode
		form.reset({ errors: {} })
	}

	return (
		<form onSubmit={handleSubmit} className="flex w-full min-w-72 max-w-[600px] flex-col gap-4">
			<SortableContext items={meta}>
				<FormBuilder
					className={twMerge('flex flex-col gap-4 p-8', rootClassNames)}
					meta={viewType === 'build' ? transformedMeta : meta}
				/>
			</SortableContext>

			<div className={twMerge(rootClassNames, 'flex items-center justify-between')}>
				<Button
					label={cancelText}
					onClick={handleCancel}
					disabled={viewType === 'build'}
					variant={viewType === 'build' ? 'disabled' : 'simple'}
				/>
				<Button
					type="submit"
					label={submitText}
					disabled={viewType === 'build'}
					variant={viewType === 'build' ? 'disabled' : 'primary'}
				/>
			</div>
		</form>
	)
}

export default SingleFormDesigner
