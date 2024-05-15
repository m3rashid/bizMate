import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useSensor, DndContext, useSensors, PointerSensor, KeyboardSensor, closestCorners } from '@dnd-kit/core'

import { useDashboardDesigner } from '../../hooks/dashboardDesigner'

function DashboardDesigner() {
	const { handleDragEnd } = useDashboardDesigner()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<div className="flex h-screen overflow-hidden">
			<div className="min-w-80 max-w-96 overflow-y-auto bg-gray-100 p-2 shadow-lg">
				<div className="flex flex-col gap-4">Left Sidebar Here</div>
			</div>

			<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
				<div className="flex w-full flex-col items-center overflow-auto bg-[url(/paper.svg)] p-4 pb-10">
					<div>Dashboard Designer Here</div>
				</div>
			</DndContext>

			<div className="">Right Sidebar here</div>
		</div>
	)
}

export default DashboardDesigner
