import Table, { TableProps } from '@components/lib/table'
import PageContainer from '@components/pageContainer'
import { Workflow } from '@mytypes'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/automations/')({
	component: Automations,
})

function Automations() {
	const { workspaceId } = useParams({ from: '/$workspaceId/automations/' })
	const tableColumns: TableProps<Workflow>['columns'] = []

	return (
		<PageContainer workspaceId={workspaceId}>
			<Table<Workflow>
				title="Workflows"
				columns={tableColumns}
				workspaceId={workspaceId}
				queryKeys={['getWorkflows']}
				paginateUrl={`/${workspaceId}/automations/all`}
				defaultEmptyStateName="automations"
				addButtonLink="/$workspaceId/automations/designer"
				description="Create and manage all automations and workflows"
			/>
		</PageContainer>
	)
}
