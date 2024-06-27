import { useFormDesigner } from '../../hooks/formDesigner'
import { supportedWidgets } from '../forms/constants'
import FormDesignerCore from './form'
import FormWidgetItem from './formWidgetItem'
import RightSidebar from './rightSidebar'
import FormDesignerTopBar from './topBar'
import { useSensor, useSensors, DndContext, PointerSensor, closestCorners, KeyboardSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

function FormDesigner() {
	const { handleDragEnd } = useFormDesigner()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
			<div className="flex h-screen overflow-hidden">
				<div className="min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-3 drop-shadow-sm">
					<div className="grid grid-cols-2 gap-3">
						{supportedWidgets.map((widgetConfig) => (
							<FormWidgetItem key={widgetConfig.name} {...widgetConfig} />
						))}
					</div>
				</div>

				<div className="flex w-full flex-col items-center overflow-auto bg-white p-4 pb-10">
					<FormDesignerTopBar />
					<FormDesignerCore />
				</div>

				<RightSidebar />
			</div>
		</DndContext>
	)
}

export default FormDesigner
