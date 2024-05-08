import { useFormDesigner } from '../../hooks/formDesigner'
import { SupportedWidgetsArray } from '../forms/constants'

export type LeftSidebarWidgetProps = SupportedWidgetsArray[number] & {
	//
}
function LeftSidebarWidget(props: LeftSidebarWidgetProps) {
	const { insertNewNode } = useFormDesigner()
	return (
		<div
			onClick={() => insertNewNode({ ...props })}
			className="cursor-pointer rounded-lg bg-white p-4 shadow-md"
		>
			<h3 className="mx-0 block select-none text-lg font-bold">{props.label}</h3>
		</div>
	)
}

export default LeftSidebarWidget
