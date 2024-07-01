import Table, { TableProps } from '@components/lib/table'
import PageContainer from '@components/pageContainer'
import { Workflow } from '@mytypes'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/automations/')({
	component: Automations,
})

function Automations() {
	const tableColumns: TableProps<Workflow>['columns'] = []

	return (
		<PageContainer>
			<Table<Workflow>
				title="Workflows"
				columns={tableColumns}
				queryKeys={['getWorkflows']}
				paginateUrl="/automations/all"
				defaultEmptyStateName="automations"
				addButtonLink="/automations/designer"
				description="Create and manage all automations and workflows"
			/>
		</PageContainer>
	)
}
