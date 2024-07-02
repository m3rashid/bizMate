import apiClient from '@api/client'
import Button from '@components/lib/button'
import Input from '@components/lib/input'
import Modal from '@components/lib/modal'
import { PlusIcon } from '@heroicons/react/24/outline'
import { usePopups } from '@hooks/popups'
import { Workspace } from '@mytypes'
import { useMutation } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'

type CreateWorkspaceProps = {
	onSuccess?: () => void
}

export function CreateWorkspace(props: CreateWorkspaceProps) {
	const { addMessagePopup } = usePopups()
	const [open, setOpen] = useState(false)

	const { mutate: createWorkspace } = useMutation({
		mutationKey: ['getUserWorkspaces'],
		onError: () => addMessagePopup({ id: 'wsCreateFailed', type: 'error', message: 'Failed to create workspace' }),
		onSuccess: () => {
			addMessagePopup({ id: 'wsCreated', type: 'success', message: 'Workspace created successfully' })
			setOpen(false)
			if (props.onSuccess) props.onSuccess()
		},
		mutationFn: (name: string) => apiClient('/auth/workspaces/create', { method: 'POST', body: JSON.stringify({ name }) }),
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.name) return
		createWorkspace(formData.name)
	}

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className="group flex h-52 w-52 cursor-pointer select-none items-center justify-center rounded-lg border-2 border-white p-2.5 shadow-lg hover:border-primary"
			>
				<div className="flex flex-col items-center justify-center rounded-lg bg-skeletonLight p-4 group-hover:bg-skeletonDark">
					<PlusIcon className="h-20 w-20 text-disabled group-hover:text-black" />
					New Workspace
				</div>
			</div>

			<Modal title="Create new Workspace" open={open} setOpen={() => setOpen(false)}>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div className="p-4">
						<Input name="name" type="name" label="Name" placeholder="BizMate Hero" required />
					</div>

					<div className="flex items-center justify-between border-t border-borderColor p-2">
						<Button size="small" variant="simple" type="button" onClick={() => setOpen(false)}>
							Close
						</Button>
						<Button size="small" type="submit">
							Create Workspace
						</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}

function WorkspaceCard(workspace: Workspace & { onClick: () => void }) {
	return (
		<div
			onClick={workspace.onClick}
			className="flex h-52 w-52 cursor-pointer select-none items-center justify-center rounded-lg border-2 border-white p-2.5 shadow-lg hover:border-primary"
		>
			<h3 className="text-center">{workspace.name}</h3>
		</div>
	)
}

export default WorkspaceCard
