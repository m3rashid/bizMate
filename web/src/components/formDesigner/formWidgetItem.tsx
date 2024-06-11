import { twMerge } from 'tailwind-merge'

import { useFormDesigner } from '../../hooks/formDesigner'
import { SupportedWidgetsArray } from '../forms/constants'

type FormWidgetItemProps = SupportedWidgetsArray[number] & {}

function FormWidgetItem(props: FormWidgetItemProps) {
	const { insertNewNode } = useFormDesigner()

	return (
		<div
			onClick={() => insertNewNode(props)}
			className={twMerge(
				'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-white bg-white px-4 py-2 text-gray-800 shadow-md hover:border-primary hover:font-semibold hover:text-primary',
				props.icon ? '' : 'py-3',
			)}
		>
			{props.icon ? <props.icon className="h-6 w-6" /> : null}
			<h3 className="mx-0 block select-none text-center text-sm">{props.label}</h3>
		</div>
	)
}

export default FormWidgetItem
