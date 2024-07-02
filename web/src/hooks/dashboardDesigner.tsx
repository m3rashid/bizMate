import { Props } from '@components/forms/exposedProps'
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { DashboardChart } from '@mytypes'
import { handleViewTransition } from '@utils/helpers'
import { atom, useRecoilState } from 'recoil'

export type DashboardWidget = DashboardChart & {
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

const dashboardDesignerAtom = atom<DashboardDesigner>({
	key: 'dashboardDesignerAtom',
	default: dashboardDesignerDefaultState,
})

export function useDashboardDesigner() {
	const [{ rootProps, viewType, dashboardWidgets, selectedNode }, setDashboardDesigner] = useRecoilState(dashboardDesignerAtom)

	function getWidgetPosition(widgets: DashboardWidget[], id: string | UniqueIdentifier): number {
		return widgets.findIndex((el) => el.id === id)
	}

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return
		handleViewTransition(() =>
			setDashboardDesigner((prev) => {
				if (!e.over) return prev
				const source = getWidgetPosition(prev.dashboardWidgets, e.active.id)
				const destination = getWidgetPosition(prev.dashboardWidgets, e.over.id)
				return { ...prev, dashboardWidgets: arrayMove(prev.dashboardWidgets, source, destination) }
			}),
		)
	}

	function changeViewType(viewType?: DashboardDesigner['viewType']) {
		handleViewTransition(() => setDashboardDesigner((prev) => ({ ...prev, viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build') })))
	}

	function insertNewWidget(widget: DashboardWidget) {
		handleViewTransition(() => setDashboardDesigner((prev) => ({ ...prev, dashboardWidgets: [...prev.dashboardWidgets, widget] })))
	}

	function getSelectedNodeProps(): { _props: Props; values: Record<string, any> } {
		if (!selectedNode) return { _props: {}, values: {} }
		return { _props: {}, values: dashboardWidgets.map((widget) => widget.id === selectedNode.id) }
	}

	function updateWidget(widgetKey: string, props: Props) {
		handleViewTransition(() =>
			setDashboardDesigner((prev) => ({
				...prev,
				dashboardWidgets: prev.dashboardWidgets.map((widget) => (widget.id === widgetKey ? { ...widget, props } : widget)),
			})),
		)
	}

	function removeWidget(id: DashboardWidget['id']) {
		handleViewTransition(() =>
			setDashboardDesigner((prev) => ({ ...prev, dashboardWidgets: prev.dashboardWidgets.filter((widget) => widget.id !== id) })),
		)
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
