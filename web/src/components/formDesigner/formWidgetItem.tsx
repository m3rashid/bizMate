import { SupportedWidgetsArray } from '@components/forms/constants'
import { useFormDesigner } from '@hooks/formDesigner'

type FormWidgetItemProps = SupportedWidgetsArray[number] & {}

function FormWidgetItem(props: FormWidgetItemProps) {
	const { insertNewNode } = useFormDesigner()

	return (
		<div
			onClick={() => insertNewNode(props)}
			className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-white bg-white p-2 text-gray-800 shadow-md hover:border-primary hover:font-semibold hover:text-primary"
		>
			{props.icon ? <props.icon className="h-6 w-6" /> : null}
			<h3 className="mx-0 block select-none text-center text-sm text-gray-600">{props.label}</h3>
		</div>
	)
}

export default FormWidgetItem
