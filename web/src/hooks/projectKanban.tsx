import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, createContext, useContext, useReducer } from 'react'

import apiClient from '../api/client'
import { PageLoader } from '../components/lib/loader'
import { getUniqueObjectsByKey } from '../utils/helpers'
import { PaginationResponse, ProjectTask, Project } from '../types'

export type UseProjectKanbanProps = {
	projectId: string
}

export type ProjectKanban = {
	page: number
	limit: number
	project: Project | null
	projectId: string | null
	addEditModalOpen: boolean
	tasksFetchpending: boolean
	tasks: ProjectTask[] | null
	editData: ProjectTask | null
}

const defaultProjectKanban: ProjectKanban = {
	page: 1,
	limit: 20,
	tasks: null,
	project: null,
	editData: null,
	projectId: null,
	tasksFetchpending: true,
	addEditModalOpen: false,
}

const projectKanbanContext = createContext<{
	refetch: () => void
	setTasks: () => void
	fetchNextPage: () => void
	projectKanban: ProjectKanban
	setLimit: (limit: number) => void
	setAddEditModalOpen: (open: boolean) => void
	setEditData: (task: ProjectTask | null) => void
}>({
	refetch: () => {},
	setTasks: () => {},
	setLimit: () => {},
	setEditData: () => {},
	fetchNextPage: () => {},
	setAddEditModalOpen: () => {},
	projectKanban: defaultProjectKanban,
})

type ProjectKanbanReducerAction =
	| { type: 'SET_LIMIT'; limit: number }
	| { type: 'FETCH_NEXT_PAGE'; page: number }
	| { type: 'SET_TASKS'; tasks: ProjectTask[] }
	| { type: 'SET_EDIT_DATA'; editData: ProjectTask | null }
	| { type: 'SET_ADD_EDIT_MODAL_OPEN'; open: boolean }
function projectKanbanReducer(state: ProjectKanban, action: ProjectKanbanReducerAction): ProjectKanban {
	if (action.type === 'SET_LIMIT') return { ...state, limit: action.limit }
	if (action.type === 'FETCH_NEXT_PAGE') return { ...state, page: action.page }
	if (action.type === 'SET_EDIT_DATA') return { ...state, editData: action.editData }
	if (action.type === 'SET_ADD_EDIT_MODAL_OPEN') return { ...state, addEditModalOpen: action.open }
	if (action.type === 'SET_TASKS') return { ...state, tasks: getUniqueObjectsByKey([...(state.tasks || []), ...(action.tasks || [])], 'id') }
	return state
}

export function ProjectKanbanProvider(props: PropsWithChildren<{ projectId: string; project: Project }>) {
	const [state, dispatch] = useReducer(projectKanbanReducer, {
		...defaultProjectKanban,
		project: props.project,
		projectId: props.projectId,
	})

	const {
		refetch,
		data: projectTasks,
		isPending: isProjectTasksFetchPending,
	} = useQuery<PaginationResponse<ProjectTask>>({
		queryKey: ['getProjectTasks', props.projectId, state.page, state.limit],
		queryFn: () => apiClient(`/projects/${state.projectId}/tasks/all`, { body: JSON.stringify({ page: state.page, limit: state.limit }) }),
	})

	if (!props.projectId || isProjectTasksFetchPending) return <PageLoader />

	return (
		<projectKanbanContext.Provider
			value={{
				projectKanban: {
					...state,
					tasksFetchpending: isProjectTasksFetchPending,
				},
				refetch,
				setLimit: (limit) => dispatch({ type: 'SET_LIMIT', limit }),
				setEditData: (editData) => dispatch({ type: 'SET_EDIT_DATA', editData }),
				setTasks: () => dispatch({ type: 'SET_TASKS', tasks: projectTasks?.docs || [] }),
				fetchNextPage: () => dispatch({ type: 'FETCH_NEXT_PAGE', page: state.page + 1 }),
				setAddEditModalOpen: (open) => dispatch({ type: 'SET_ADD_EDIT_MODAL_OPEN', open }),
			}}
		>
			{props.children}
		</projectKanbanContext.Provider>
	)
}

export function useProjectKanban() {
	const { fetchNextPage, projectKanban, setAddEditModalOpen, setEditData, setLimit, setTasks, refetch } = useContext(projectKanbanContext)

	function onEditTask(task: ProjectTask) {
		setEditData(task)
		setAddEditModalOpen(true)
	}

	function onAddTask() {
		setEditData(null)
		setAddEditModalOpen(true)
	}

	function onDragStart() {}

	function onDragOver() {}

	function onDragEnd() {}

	return {
		refetch,
		setLimit,
		setTasks,
		onAddTask,
		onDragEnd,
		onDragOver,
		onEditTask,
		onDragStart,
		fetchNextPage,
		projectKanban,
		setAddEditModalOpen,
	}
}
