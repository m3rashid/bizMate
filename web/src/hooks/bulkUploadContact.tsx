import { parse } from 'papaparse'
import { ChangeEvent, Dispatch, FormEvent, PropsWithChildren, SetStateAction, createContext, useContext, useReducer } from 'react'

import { Option } from '../types'
import { camelCaseToSentenceCase } from '../utils/helpers'
import { ActionPopupType, MessagePopupType, usePopups } from './popups'

export const modalStates = ['selectUploadType', 'upload', 'mapping', 'confirm'] as const
export type ModalState = (typeof modalStates)[number]

export const uploadFileTypeOptions = [
	'csv',
	// 'excel' // NOT implemented as of now
] as const
export type UploadFileType = (typeof uploadFileTypeOptions)[number]

export const modalTitleMap: Record<ModalState, string> = {
	upload: 'Upload file',
	mapping: 'Create Mappings',
	selectUploadType: 'Select Upload Type',
	confirm: 'Confirm Upload',
}

export const contactFields = ['name', 'email', 'phone', 'birthday'] as const

export type BulkUploadContactModalProps = {
	open: boolean
	refetch: () => void
	setOpen: Dispatch<SetStateAction<boolean>>
}

type BulkUpload = {
	file: File | null
	mappingKeys: Option[]
	modalState: ModalState
	uploadFileType: UploadFileType
	mappings: Record<(typeof contactFields)[number], string>
}

const bulkUploadDefaultState: BulkUpload = {
	file: null,
	mappingKeys: [],
	modalState: 'selectUploadType',
	uploadFileType: 'csv',
	mappings: { name: '', email: '', phone: '', birthday: '' },
}

type AddActionPopup = (popup: ActionPopupType) => void
type AddMessagePopup = (messagepopup: MessagePopupType) => void
type Popups = { addMessagePopup: AddMessagePopup; addActionPopup: AddActionPopup }

type Action =
	| { type: 'RESET' }
	| { type: 'GO_BACK' }
	| (Popups & { type: 'GO_AHEAD' })
	| { type: 'SELECT_UPLOAD_FILE_TYPE'; fileType: UploadFileType; addMessagePopup: AddMessagePopup }
	| (Popups & { type: 'SUBMIT_MAPPINGS'; formEvent: FormEvent<HTMLFormElement> })
	| { type: 'FILE_UPLOADED'; file: File; mappingKeys: Option[] }
function bulkUploadReducer(state: BulkUpload, action: Action): BulkUpload {
	// TODO: only csv handled here, excel is not handled
	if (action.type === 'RESET') return bulkUploadDefaultState

	if (action.type === 'GO_BACK') {
		const prevIndex = modalStates.indexOf(state.modalState)
		return { ...state, modalState: prevIndex === 0 ? state.modalState : modalStates[prevIndex - 1] }
	}

	if (action.type === 'GO_AHEAD') {
		if (state.modalState === 'upload') {
			if (!state.file) {
				action.addMessagePopup({ id: 'noFile', message: 'Please upload a file', type: 'error' })
				return state
			}

			if (state.mappingKeys.length !== 0) return { ...state, modalState: 'mapping' }
			action.addActionPopup({
				type: 'error',
				id: 'noMappings',
				title: 'Please select a valid file',
				children: 'There are no mappings in the current file',
			})
			return state
		}

		if (state.modalState === 'mapping') {
			if (state.mappings.name && state.mappings.email) return { ...state, modalState: 'confirm' }
			action.addMessagePopup({ id: 'requiredFields', message: 'Name and Email are required fields', type: 'error' })
			return state
		}

		return state
	}

	if (action.type === 'SELECT_UPLOAD_FILE_TYPE') {
		if (state.modalState !== 'selectUploadType') return state
		if (!action.fileType) {
			action.addMessagePopup({ id: 'selectUploadFileType', message: 'Please select a file type', type: 'error' })
			return state
		}
		return { ...state, uploadFileType: action.fileType, modalState: 'upload' }
	}

	if (action.type === 'SUBMIT_MAPPINGS') {
		action.formEvent.preventDefault()
		const formData = Object.fromEntries(new FormData(action.formEvent.target as HTMLFormElement).entries()) as any
		if (!formData.name || !formData.email) {
			action.addMessagePopup({ id: 'requiredFields', message: 'Name and Email are required fields', type: 'error' })
			return state
		}

		return {
			...state,
			modalState: 'confirm',
			mappings: { name: formData.name || '', email: formData.email || '', phone: formData.phone || '', birthday: formData.birthday || '' },
		}
	}

	if (action.type === 'FILE_UPLOADED') {
		return { ...state, file: action.file, mappingKeys: action.mappingKeys }
	}

	return state
}

const bulkUploadContext = createContext<[data: BulkUpload, dispatch: Dispatch<Action>]>([bulkUploadDefaultState, () => {}])
export function BulkUplaodProvider(props: PropsWithChildren) {
	const [data, dispatch] = useReducer(bulkUploadReducer, bulkUploadDefaultState)
	return <bulkUploadContext.Provider value={[data, dispatch]}>{props.children}</bulkUploadContext.Provider>
}

export function useBulkUploadContact() {
	const { addMessagePopup, addActionPopup } = usePopups()
	const [{ file, mappingKeys, mappings, modalState, uploadFileType }, dispatch] = useContext(bulkUploadContext)

	function onSelectUploadFileType(type: UploadFileType) {
		dispatch({ type: 'SELECT_UPLOAD_FILE_TYPE', fileType: type, addMessagePopup })
	}

	function handleSubmitMappings(e: FormEvent<HTMLFormElement>) {
		dispatch({ type: 'SUBMIT_MAPPINGS', formEvent: e, addMessagePopup, addActionPopup })
	}

	function onFileUpload(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault()
		const uploadedFile = e.target.files?.[0]
		if (!uploadedFile) {
			addMessagePopup({ id: 'noFile', message: 'Please upload a file', type: 'error' })
			return
		}
		parse(uploadedFile, {
			header: true,
			step: (result, parser) => {
				parser.abort()
				if (!result.meta.fields) {
					addMessagePopup({ id: 'noFields', message: 'No fields found to map', type: 'error' })
					return
				}
				dispatch({
					type: 'FILE_UPLOADED',
					file: uploadedFile,
					mappingKeys: result.meta.fields.map<Option>((field) => ({ id: field, label: camelCaseToSentenceCase(field), value: field })),
				})
			},
		})
	}

	function resetModal() {
		dispatch({ type: 'RESET' })
	}

	function goAhead() {
		dispatch({ type: 'GO_AHEAD', addMessagePopup, addActionPopup })
	}

	function goBack() {
		dispatch({ type: 'GO_BACK' })
	}

	return {
		file,
		mappingKeys,
		mappings,
		modalState,
		uploadFileType,

		goBack,
		goAhead,
		resetModal,
		onFileUpload,
		handleSubmitMappings,
		onSelectUploadFileType,
	}
}
