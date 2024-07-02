import AddWidget from '@components/dashboardDesigner/addWidget'
import ShowDashboard from '@components/dashboardDesigner/showDashboards'
import Button from '@components/lib/button'
import useAddDashboardWidget from '@hooks/addDashboardWidget'

function DashboardDesigner(props: { dashboardId: string; workspaceId: string }) {
	const { openModal } = useAddDashboardWidget()

	return (
		<>
			<div className="flex items-center justify-end gap-4">
				<Button size="small" onClick={openModal}>
					Add Widget
				</Button>
			</div>

			<AddWidget dashboardId={props.dashboardId} workspaceId={props.workspaceId} />

			<ShowDashboard dashboardId={props.dashboardId} workspaceId={props.workspaceId} viewType="edit" />
		</>
	)
}

export default DashboardDesigner
