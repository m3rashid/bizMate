import apiClient from '../../api/client'
import { Widget } from '../../types'
import Button from '../lib/button'
import Modal from '../lib/modal'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, FormEvent, SetStateAction } from 'react'

type AddWidgetProps = {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	editData?: Widget
}

function AddWidget(props: AddWidgetProps) {
	const { data } = useQuery({
		queryKey: ['dashboardModels'],
		queryFn: () => apiClient('/dashboards/models'),
	})

	function handleAddEditWidget(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
	}

	return (
		<>
			<Modal open={props.open} setOpen={props.setOpen} title={!!props.editData ? 'Update Widget' : 'Add Widget'}>
				<form className="h-full" onSubmit={handleAddEditWidget}>
					<div className="flex flex-col gap-4 p-4"></div>

					<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
						<Button variant="simple" type="reset">
							Reset
						</Button>
						<Button type="submit">{!!props.editData ? 'Update' : 'Create'}</Button>
					</div>
				</form>
			</Modal>
		</>
	)
}

export default AddWidget
