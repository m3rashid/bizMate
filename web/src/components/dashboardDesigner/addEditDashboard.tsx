import Button from '@components/lib/button'
import Input from '@components/lib/input'
import Modal from '@components/lib/modal'
import TextAreaInput from '@components/lib/textAreaInput'
import TogglerInput from '@components/lib/toggle'
import useAddEditDashboard, { AddEditDashboardProps } from '@hooks/addEditDashboard'
import { handleViewTransition } from '@utils/helpers'
import { useTranslation } from 'react-i18next'

function AddEditDashboard(props: AddEditDashboardProps) {
	const { t } = useTranslation()
	const { handleAddEditDashboard } = useAddEditDashboard(props)

	return (
		<Modal
			open={props.open}
			setOpen={() => handleViewTransition(() => props.setOpen(false))}
			title={!!props.dashboard ? `${t('Edit Dashboard')} (${props.dashboard.title})` : t('Add Dashboard')}
		>
			<form className="h-full" onSubmit={handleAddEditDashboard}>
				<div className="flex flex-col gap-4 p-4">
					<Input name="title" label="Title" placeholder={t('Dashboard Title')} required defaultValue={props.dashboard?.title} />

					<TextAreaInput
						name="description"
						label={t('Description')}
						placeholder={t('How would you describe this dashboard')}
						defaultValue={props.dashboard?.description}
					/>

					{!!props.dashboard ? (
						<TogglerInput
							required
							name="active"
							label={t('Active')}
							defaultChecked={props.dashboard.active}
							descriptionText={t('Active dashboards would be visible on the homepage')}
						/>
					) : null}
				</div>

				<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
					<Button variant="simple" type="reset">
						{t('Reset')}
					</Button>
					<Button type="submit">{!!props.dashboard ? t('Update') : t('Create')}</Button>
				</div>
			</form>
		</Modal>
	)
}

export default AddEditDashboard
