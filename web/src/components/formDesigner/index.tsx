import {
	useSensor,
	useSensors,
	DndContext,
	PointerSensor,
	closestCorners,
	KeyboardSensor,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import FormDesignerCore from './form'
import FormDesignerTopBar from './topBar'
import RightSidebar from './rightSidebar'
import LeftSidebarWidget from './leftSidebar'
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
		<div className="flex h-screen overflow-hidden">
			<div className="min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-2 shadow-lg">
				<div className="flex flex-col gap-4">
					{supportedWidgets.map((widgetConfig) => (
						<LeftSidebarWidget key={widgetConfig.name} {...widgetConfig} />
					))}
				</div>
			</div>

			<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
				<div className="flex w-full flex-col items-center overflow-auto bg-[url(/paper.svg)] p-4 pb-10">
					<FormDesignerTopBar />
					<FormDesignerCore />
				</div>
			</DndContext>

			<RightSidebar />
		</div>
	)
}

export default FormDesigner
