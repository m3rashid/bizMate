import useAddDashboardWidget from '../../hooks/addDashboardWidget'
import Button from '../lib/button'
import AddWidget from './addWidget'
import ShowDashboard from './showDashboards'

function DashboardDesigner(props: { dashboardId: string | number }) {
	const { openModal } = useAddDashboardWidget()

	return (
		<>
			<div className="flex items-center justify-end gap-4">
				<Button size="small" onClick={openModal}>
					Add Widget
				</Button>
			</div>

			<AddWidget dashboardId={props.dashboardId} />
			<ShowDashboard dashboardId={props.dashboardId} viewType="edit" />
		</>
	)
}

export default DashboardDesigner
