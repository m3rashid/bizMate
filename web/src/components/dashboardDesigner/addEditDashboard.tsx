import useAddEditDashboard, { AddEditDashboardProps } from '../../hooks/addEditDashboard'
import { handleViewTransition } from '../../utils/helpers'
import Button from '../lib/button'
import Input from '../lib/input'
import Modal from '../lib/modal'
import TextAreaInput from '../lib/textAreaInput'
import TogglerInput from '../lib/toggle'

function AddEditDashboard(props: AddEditDashboardProps) {
	const { handleAddEditDashboard } = useAddEditDashboard(props)

	return (
		<Modal
			open={props.open}
			setOpen={() => handleViewTransition(() => props.setOpen(false))}
			title={`Edit Dashboard ${props.dashboard ? `(${props.dashboard.title})` : ''}`}
		>
			<form className="h-full" onSubmit={handleAddEditDashboard}>
				<div className="flex flex-col gap-4 p-4">
					<Input name="title" label="Title" placeholder="Dashboard Title" required defaultValue={props.dashboard?.title} />

					<TextAreaInput
						name="description"
						label="Description"
						placeholder="How would you describe this dashboard"
						defaultValue={props.dashboard?.description}
					/>

					{!!props.dashboard ? (
						<TogglerInput name="active" label="Active" required descriptionText="Active dashboards would be visible on the homepage" />
					) : null}
				</div>

				<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
					<Button variant="simple" type="reset">
						Reset
					</Button>
					<Button type="submit">{!!props.dashboard ? 'Update' : 'Create'}</Button>
				</div>
			</form>
		</Modal>
	)
}

export default AddEditDashboard
