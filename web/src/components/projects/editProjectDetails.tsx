import { useEffect, useState } from 'react'
import '@blocknote/mantine/style.css'
import { twMerge } from 'tailwind-merge'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BlockNoteView } from '@blocknote/mantine'
import { useCreateBlockNote } from '@blocknote/react'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'

import Chip from '../lib/chip'
import Button from '../lib/button'
import { Project } from '../../types'
import apiClient from '../../api/client'
import { PageLoader } from '../lib/loader'
import { usePopups } from '../../hooks/popups'
import { toSentenceCase, safeJsonParse } from '../../utils/helpers'

type ProjectDetailType = 'readme' | 'guidelines' | 'docs'
export type EditProjectDetailsProps = {
	projectId: string
	type: ProjectDetailType
}

function Editor(props: EditProjectDetailsProps & { project: Project; editable: boolean; onSuccess: () => void }) {
	const { addMessagePopup } = usePopups()
	const { mutate: editProject } = useMutation({
		onSuccess: () => {
			props.onSuccess()
			addMessagePopup({ message: 'Project details updated successfully', type: 'success', id: Math.random().toString() })
		},
		mutationKey: ['editProjectDetails', props.type],
		mutationFn: (data: Partial<Project>) => apiClient(`/projects/${props.projectId}/update`, { method: 'POST', body: JSON.stringify(data) }),
	})

	const editor = useCreateBlockNote({
		...(!!props.project[props.type]
			? { initialContent: safeJsonParse(props.project[props.type] as string, undefined, (res) => res.length > 0) }
			: {}),
	})

	useEffect(() => {
		if (!props.editable) {
			const content = props.project[props.type]
			const edContent = JSON.stringify(editor.document)
			if (content !== edContent) {
				editProject({ [props.type]: edContent })
			}
		}
	}, [props.editable])

	return (
		<BlockNoteView
			theme="light"
			editor={editor}
			itemType="input"
			editable={props.editable}
			className={twMerge(
				'w-full border-0 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6',
				props.editable ? 'rounded-lg ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600' : '',
			)}
		/>
	)
}

function EditProjectDetails(props: EditProjectDetailsProps) {
	const [editable, setEditable] = useState(false)

	const { data: project, isPending } = useQuery<Project>({
		queryKey: ['getProject', props.projectId],
		queryFn: () => apiClient(`/projects/one/${props.projectId}`),
	})

	function onSuccess() {
		setEditable(false)
	}

	if (isPending || !project) return <PageLoader />

	return (
		<div className="relative">
			<div className="absolute right-2 top-2 z-50 flex items-center gap-2">
				<Button size="small" onClick={() => setEditable((p) => !p)} LeftIcon={<PencilSquareIcon className="h-4 w-4" />}>
					{editable ? 'Confirm' : 'Edit'}
				</Button>
				<Chip className="border-2 bg-transparent text-black">{toSentenceCase(props.type)}</Chip>
			</div>
			<Editor {...{ editable, project, onSuccess, ...props }} />
		</div>
	)
}

export default EditProjectDetails
