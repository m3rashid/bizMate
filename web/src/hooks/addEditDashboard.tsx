import apiClient from '@api/client'
import { usePopups } from '@hooks/popups'
import { Dashboard } from '@mytypes'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, FormEvent, SetStateAction } from 'react'

export type AddEditDashboardProps = { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; workspaceId: string } & (
	| { dashboard: undefined }
	| { dashboard: Dashboard; refetch: () => void }
)

function useAddEditDashboard(props: AddEditDashboardProps) {
	const { addMessagePopup } = usePopups()

	const { mutate: createDashboard } = useMutation({
		mutationKey: ['createDashboard'],
		mutationFn: (dashboard: Partial<Dashboard>) => apiClient('/dashboards/create', { method: 'POST', body: JSON.stringify(dashboard) }),
		onSuccess: () => {
			props.setOpen(false)
			addMessagePopup({ id: 'createDashboardSuccess', type: 'success', message: 'Dashboard created Successfully' })
			if (props.dashboard) props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'createDashboardError', type: 'error', message: 'Error in creating dashboard' })
		},
	})

	const { mutate: updateDashboard } = useMutation({
		mutationKey: ['updateDashboard'],
		mutationFn: (dashboard: Partial<Dashboard>) =>
			apiClient(`/${props.workspaceId}/dashboards/update/${props.dashboard?.id}`, { method: 'POST', body: JSON.stringify(dashboard) }),
		onSuccess: () => {
			props.setOpen(false)
			addMessagePopup({ id: 'updateDashboardSuccess', type: 'success', message: 'Dashboard updated Successfully' })
			if (props.dashboard) props.refetch()
		},
		onError: () => {
			addMessagePopup({ id: 'updateDashboardError', type: 'error', message: 'Error in updating dashboard' })
		},
	})

	function handleAddEditDashboard(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (!formData.title) {
			addMessagePopup({ id: 'noTitleDashboard', message: 'Dashboard title is required', type: 'error' })
			return
		}

		if (!!props.dashboard) {
			updateDashboard({ title: formData.title, description: formData.description || props.dashboard.description, active: formData.active === 'on' })
		} else {
			createDashboard({ title: formData.title, description: formData.description || '' })
		}
	}

	return {
		handleAddEditDashboard,
	}
}

export default useAddEditDashboard
