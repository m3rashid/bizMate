import { useReducer } from 'react'

import { ProjectTask } from '../types'

type State = { modalOpen: boolean; editData: ProjectTask | null }
const initialState: State = { editData: null, modalOpen: false }
type AddEditReducerAction = { type: 'ADD_TASK' } | { type: 'EDIT_TASK'; editData: ProjectTask } | { type: 'CLOSE_MODAL' }
function addEditReducer(state: State, action: AddEditReducerAction): State {
	if (action.type === 'ADD_TASK') return { modalOpen: true, editData: null }
	if (action.type === 'EDIT_TASK') return { modalOpen: true, editData: action.editData }
	if (action.type === 'CLOSE_MODAL') return { modalOpen: false, editData: null }
	return state
}

export function useAddEditProjectTask() {
	const [state, dispatch] = useReducer(addEditReducer, initialState)
	return {
		state,
		onClose: () => dispatch({ type: 'CLOSE_MODAL' }),
		onAddTask: () => dispatch({ type: 'ADD_TASK' }),
		onEditTask: (task: ProjectTask) => dispatch({ type: 'EDIT_TASK', editData: task }),
	}
}
