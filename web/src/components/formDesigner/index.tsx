import FormDesignerCore from '@components/formDesigner/form'
import FormWidgetItem from '@components/formDesigner/formWidgetItem'
import RightSidebar from '@components/formDesigner/rightSidebar'
import FormDesignerTopBar from '@components/formDesigner/topBar'
import { supportedWidgets } from '@components/forms/constants'
import { useSensor, useSensors, DndContext, PointerSensor, closestCorners, KeyboardSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useFormDesigner } from '@hooks/formDesigner'

function FormDesigner(props: { workspaceId: string; formId: string }) {
	const { handleDragEnd } = useFormDesigner()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
			<div className="flex h-full">
				<div className="min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-3 drop-shadow-sm">
					<div className="grid grid-cols-2 gap-3">
						{supportedWidgets.map((widgetConfig) => (
							<FormWidgetItem key={widgetConfig.name} {...widgetConfig} />
						))}
					</div>
				</div>

				<div className="flex w-full flex-col items-center overflow-auto bg-white p-4 pb-10">
					<FormDesignerTopBar workspaceId={props.workspaceId} formId={props.formId} />
					<FormDesignerCore />
				</div>

				<RightSidebar />
			</div>
		</DndContext>
	)
}

export default FormDesigner
