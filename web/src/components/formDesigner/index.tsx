import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useSensor, useSensors, DndContext, PointerSensor, closestCorners, KeyboardSensor } from '@dnd-kit/core'

import FormDesignerCore from './form'
import FormDesignerTopBar from './topBar'
import RightSidebar from './rightSidebar'
import FormWidgetItem from './formWidgetItem'
import { supportedWidgets } from '../forms/constants'
import { useFormDesigner } from '../../hooks/formDesigner'

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
				<div className="min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-2 shadow-lg">
					<div className="grid grid-cols-2 gap-4">
						{supportedWidgets.map((widgetConfig) => (
							<FormWidgetItem key={widgetConfig.name} {...widgetConfig} />
						))}
					</div>
				</div>

				<div className="flex w-full flex-col items-center overflow-auto bg-[url(/paper.svg)] p-4 pb-10">
					<FormDesignerTopBar />
					<FormDesignerCore />
				</div>

				<RightSidebar />
			</div>
		</DndContext>
	)
}

export default FormDesigner
