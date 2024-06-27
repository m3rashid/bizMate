import { useDashboardDesigner } from '../../hooks/dashboardDesigner'
import Button from '../lib/button'
import AddWidget from './addWidget'
import { useSensor, DndContext, useSensors, PointerSensor, KeyboardSensor, closestCorners } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'

function DashboardDesigner() {
	const [open, setOpen] = useState(false)
	const { handleDragEnd } = useDashboardDesigner()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<>
			<Button size="small" onClick={() => setOpen(true)}>
				Add Widget
			</Button>
			<AddWidget open={open} setOpen={setOpen} />

			<DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
				<div className="flex w-full flex-col items-center overflow-auto p-4">
					<div>Dashboard Designer Here</div>
				</div>
			</DndContext>
		</>
	)
}

export default DashboardDesigner
