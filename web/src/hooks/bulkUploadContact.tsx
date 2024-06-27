import { Option } from '../types'
import { camelCaseToSentenceCase } from '../utils/helpers'
import { usePopups } from './popups'
import { parse } from 'papaparse'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react'
import { atom, useRecoilState } from 'recoil'

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

const bulkUploadAtom = atom<BulkUpload>({
	key: 'bulkUploadAtom',
	default: bulkUploadDefaultState,
})

export function useBulkUploadContact() {
	const { addMessagePopup, addActionPopup } = usePopups()
	const [{ file, mappingKeys, mappings, modalState, uploadFileType }, setBulkUpload] = useRecoilState(bulkUploadAtom)

	function onSelectUploadFileType(type: UploadFileType) {
		setBulkUpload((state) => {
			if (state.modalState !== 'selectUploadType') return state
			if (!type) {
				addMessagePopup({ id: 'selectUploadFileType', message: 'Please select a file type', type: 'error' })
				return state
			}
			return { ...state, uploadFileType: type, modalState: 'upload' }
		})
	}

	function handleSubmitMappings(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.name || !formData.email) {
			addMessagePopup({ id: 'requiredFields', message: 'Name and Email are required fields', type: 'error' })
			return
		}
		setBulkUpload((prev) => ({
			...prev,
			modalState: 'confirm',
			mappings: { name: formData.name || '', email: formData.email || '', phone: formData.phone || '', birthday: formData.birthday || '' },
		}))
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
				setBulkUpload((prev) => ({
					...prev,
					file: uploadedFile,
					mappingKeys: (result.meta.fields || []).map<Option>((field) => ({ id: field, label: camelCaseToSentenceCase(field), value: field })),
				}))
			},
		})
	}

	function resetModal() {
		setBulkUpload(bulkUploadDefaultState)
	}

	function goAhead() {
		setBulkUpload((prev) => {
			if (prev.modalState === 'upload') {
				if (!prev.file) {
					addMessagePopup({ id: 'noFile', message: 'Please upload a file', type: 'error' })
					return prev
				}

				if (prev.mappingKeys.length !== 0) return { ...prev, modalState: 'mapping' }
				addActionPopup({
					type: 'error',
					id: 'noMappings',
					title: 'Please select a valid file',
					children: 'There are no mappings in the current file',
				})
				return prev
			}

			if (prev.modalState === 'mapping') {
				if (prev.mappings.name && prev.mappings.email) return { ...prev, modalState: 'confirm' }
				addMessagePopup({ id: 'requiredFields', message: 'Name and Email are required fields', type: 'error' })
				return prev
			}
			return prev
		})
	}

	function goBack() {
		setBulkUpload((prev) => {
			const prevIndex = modalStates.indexOf(prev.modalState)
			return { ...prev, modalState: prevIndex === 0 ? prev.modalState : modalStates[prevIndex - 1] }
		})
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
