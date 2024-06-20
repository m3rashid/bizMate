import { useReducer } from 'react'
import { twMerge } from 'tailwind-merge'

import Uploader from './upload'
import Modal from '../lib/modal'
import Button, { ButtonProps } from '../lib/button'

type UploadProps = {
	buttonProps?: ButtonProps
	onFinalize: (urls: string[]) => void
}

type UploadModalState = {
	open: boolean
	type: 'select' | 'upload'
}

const modalTitle: Record<UploadModalState['type'], string> = {
	select: 'Select files',
	upload: 'Upload files',
}

type Action = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'SELECT' } | { type: 'UPLOAD' } | { type: 'ADD_FILES'; files: File[] }

function uploadModalReducer(state: UploadModalState, action: Action): UploadModalState {
	if (action.type === 'OPEN') return { ...state, open: true }
	if (action.type === 'CLOSE') return { ...state, open: false }
	if (action.type === 'SELECT') return { ...state, open: true, type: 'select' }
	if (action.type === 'UPLOAD') return { ...state, open: true, type: 'upload' }
	return state
}

function Upload(props: UploadProps) {
	const [{ open, type }, dispatch] = useReducer(uploadModalReducer, { type: 'select', open: false })

	function handleFinalize() {}

	return (
		<>
			<Button size="small" onClick={() => dispatch({ type: 'OPEN' })} {...props.buttonProps}>
				Choose Files
			</Button>

			<Modal title={modalTitle[type]} open={open} setOpen={() => dispatch({ type: 'CLOSE' })}>
				<div className="flex items-center gap-8 bg-primaryLight p-3 pb-0">
					{Object.keys(modalTitle).map((key) => (
						<div
							key={key}
							onClick={() => dispatch({ type: key === 'upload' ? 'UPLOAD' : 'SELECT' })}
							className={twMerge(
								'cursor-pointer rounded-sm border-b-[3px] border-b-primaryLight hover:border-b-white ',
								type === key ? 'border-b-primary font-bold hover:border-b-primary' : '',
							)}
						>
							{modalTitle[key as UploadModalState['type']]}
						</div>
					))}
				</div>

				<div className="my-1 h-96 overflow-auto p-4">
					{type === 'select' ? (
						Array.from({ length: 20 }).map((_, i) => (
							<div key={i} className="h-20">
								Not implemented {i}
							</div>
						))
					) : (
						<div className="flex h-full items-center justify-center">
							<Uploader onFinalize={props.onFinalize} />
						</div>
					)}
				</div>
				<div className="flex items-center justify-between p-4">
					<Button variant="simple">Cancel</Button>
					<Button onClick={handleFinalize}>Done</Button>
				</div>
			</Modal>
		</>
	)
}

export default Upload
