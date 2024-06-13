import { DragEndEvent } from '@dnd-kit/core'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from 'react'

import { handleViewTransition } from '../utils/helpers'

export type EmailDesigner = {
	rootProps: {
		title: string
		description: string
		subjectTemplate: string
	}
	viewType: 'build' | 'preview'
}

const emailDesignerDefaultState: EmailDesigner = {
	rootProps: {
		title: 'New Untitled Email',
		description: 'This is a new email',
		subjectTemplate: '',
	},
	viewType: 'build',
}

const emailDesignerContext = createContext<[emailDesigner: EmailDesigner, setEmailDesigner: Dispatch<SetStateAction<EmailDesigner>>]>([
	emailDesignerDefaultState,
	() => {},
])

export function EmailDesignerProvider({ children }: PropsWithChildren) {
	const [emailDesigner, setEmailDesigner] = useState<EmailDesigner>(emailDesignerDefaultState)
	return <emailDesignerContext.Provider value={[emailDesigner, setEmailDesigner]}>{children}</emailDesignerContext.Provider>
}

export function useEmailDesigner() {
	const [{ rootProps }, setEmailDesigner] = useContext(emailDesignerContext)

	function handleDragEnd(e: DragEndEvent) {
		if (!e.over || e.active.id === e.over.id) return
		handleViewTransition(() =>
			setEmailDesigner((prev) => {
				if (!e.over) return prev
				// const source = getTaskPosition(prev.meta, e.active.id)
				// const destination = getTaskPosition(prev.meta, e.over.id)
				// return { ...prev, meta: arrayMove(prev.meta, source, destination) }
				return prev
			}),
		)
	}

	function changeViewType(viewType?: EmailDesigner['viewType']) {
		handleViewTransition(() => setEmailDesigner((prev) => ({ ...prev, viewType: viewType || (prev.viewType === 'build' ? 'preview' : 'build') })))
	}

	return {
		rootProps,
		handleDragEnd,
		changeViewType,
		setEmailDesigner,
	}
}
