import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, useState, useContext, createContext, SetStateAction, PropsWithChildren } from 'react'

import { Widget } from '../types'
import { Props } from '../components/forms/exposedProps'

export type DashboardWidget = Widget & {
	id: string
}

export type DashboardDesigner = {
	rootProps: {
		title: string
		description?: string
	}
	viewType: 'build' | 'preview'
	dashboardWidgets: DashboardWidget[]
	selectedNode: DashboardWidget | null
}

const dashboardDesignerDefaultState: DashboardDesigner = {
	rootProps: {
		title: 'New Dashboard',
		description: 'This is a new dashboard',
	},
	viewType: 'build',
	selectedNode: null,
	dashboardWidgets: [],
}

const dashboardDesignerContext = createContext<
	[dashboardDesigner: DashboardDesigner, setDashboardDesigner: Dispatch<SetStateAction<DashboardDesigner>>]
>([dashboardDesignerDefaultState, () => {}])

export function DashboardDesignerProvider({ children }: PropsWithChildren) {
	const [dashboardDesigner, setDashboardDesigner] = useState<DashboardDesigner>(dashboardDesignerDefaultState)
	return <dashboardDesignerContext.Provider value={[dashboardDesigner, setDashboardDesigner]}>{children}</dashboardDesignerContext.Provider>
}

export function useDashboardDesigner() {
	const [{ rootProps, viewType, dashboardWidgets, selectedNode }, setDashboardDesigner] = useContext(dashboardDesignerContext)

	function getWidgetPosition(widgets: DashboardWidget[], id: string | UniqueIdentifier): number {
		return widgets.findIndex((el) => el.id === id)
	}

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return
		setDashboardDesigner((prev) => {
			if (!e.over) return prev
			const source = getWidgetPosition(prev.dashboardWidgets, e.active.id)
			const destination = getWidgetPosition(prev.dashboardWidgets, e.over.id)
			return { ...prev, dashboardWidgets: arrayMove(prev.dashboardWidgets, source, destination) }
		})
	}

	function changeViewType(viewType?: DashboardDesigner['viewType']) {
		setDashboardDesigner((prev) => ({ ...prev, viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build') }))
	}

	function insertNewWidget(widget: DashboardWidget) {
		setDashboardDesigner((prev) => ({ ...prev, dashboardWidgets: [...prev.dashboardWidgets, widget] }))
	}

	function getSelectedNodeProps(): { _props: Props; values: Record<string, any> } {
		if (!selectedNode) return { _props: {}, values: {} }
		return { _props: {}, values: dashboardWidgets.map((widget) => widget.id === selectedNode.id) }
	}

	function updateWidget(widgetKey: string, props: Props) {
		setDashboardDesigner((prev) => ({
			...prev,
			dashboardWidgets: prev.dashboardWidgets.map((widget) => (widget.id === widgetKey ? { ...widget, props } : widget)),
		}))
	}

	function removeWidget(id: DashboardWidget['id']) {
		setDashboardDesigner((prev) => ({ ...prev, dashboardWidgets: prev.dashboardWidgets.filter((widget) => widget.id !== id) }))
	}

	return {
		viewType,
		rootProps,
		removeWidget,
		updateWidget,
		selectedNode,
		handleDragEnd,
		changeViewType,
		insertNewWidget,
		dashboardWidgets,
		getSelectedNodeProps,
	}
}
