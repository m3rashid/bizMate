import { DragEndEvent } from '@dnd-kit/core'
import { Dispatch, useState, useContext, createContext, SetStateAction, PropsWithChildren } from 'react'

export type DashboardDesigner = {
	rootProps: {}
	viewType: 'build' | 'preview'
}

const dashboardDesignerDefaultState: DashboardDesigner = {
	rootProps: {},
	viewType: 'build',
}

const dashboardDesignerContext = createContext<
	[dashboardDesigner: DashboardDesigner, setDashboardDesigner: Dispatch<SetStateAction<DashboardDesigner>>]
>([dashboardDesignerDefaultState, () => {}])

export function DashboardDesignerProvider({ children }: PropsWithChildren) {
	const [dashboardDesigner, setDashboardDesigner] = useState<DashboardDesigner>(dashboardDesignerDefaultState)
	return <dashboardDesignerContext.Provider value={[dashboardDesigner, setDashboardDesigner]}>{children}</dashboardDesignerContext.Provider>
}

export function useDashboardDesigner() {
	const [{ rootProps, viewType }, setDashboardDesigner] = useContext(dashboardDesignerContext)

	function changeViewType(viewType?: DashboardDesigner['viewType']) {
		setDashboardDesigner((prev) => ({
			...prev,
			viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build'),
		}))
	}

	function handleDragEnd(e: DragEndEvent) {}

	return {
		viewType,
		rootProps,
		handleDragEnd,
		changeViewType,
	}
}
