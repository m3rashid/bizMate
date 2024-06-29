import useAddDashboardWidget from '../../hooks/addDashboardWidget'
import Button from '../lib/button'
import AddWidget from './addWidget'
import ShowDashboard from './showDashboards'

function DashboardDesigner(props: { dashboardId: string | number }) {
	const { openModal } = useAddDashboardWidget()

	return (
		<>
			<Button size="small" onClick={openModal}>
				Add Widget
			</Button>
			<AddWidget dashboardId={props.dashboardId} />
			<ShowDashboard dashboardId={props.dashboardId} />
		</>
	)
}

export default DashboardDesigner
