import AddKpiModel from '@components/dashboardDesigner/addKpi'
import Button from '@components/lib/button'
import Modal from '@components/lib/modal'
import SingleSelectInput from '@components/lib/singleSelectInput'
import useAddDashboardWidget from '@hooks/addDashboardWidget'
import { FormEvent } from 'react'

function AddWidget(props: { dashboardId: string }) {
	const { modalTitle, closeModal, modalOpen, setWidgetType, modalState, widgetType } = useAddDashboardWidget()
	function handleSetWidgetType(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (formData.type) setWidgetType(formData.type)
	}

	return (
		<>
			<Modal open={modalOpen} setOpen={closeModal} title={modalTitle}>
				{modalState === 'selectType' ? (
					<form className="h-full" onSubmit={handleSetWidgetType}>
						<div className="flex flex-col gap-4 p-4">
							<SingleSelectInput name="type" options={['kpi', 'chart']} label="Select Widget Type" />
						</div>

						<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
							<Button variant="simple" type="reset">
								Reset
							</Button>
							<Button type="submit">Confirm</Button>
						</div>
					</form>
				) : widgetType === 'kpi' ? (
					<AddKpiModel dashboardId={props.dashboardId} />
				) : null}
			</Modal>
		</>
	)
}

export default AddWidget
