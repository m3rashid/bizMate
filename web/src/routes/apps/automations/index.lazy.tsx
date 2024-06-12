import { createLazyFileRoute } from '@tanstack/react-router'

import { Workflow } from '../../../types'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createLazyFileRoute('/apps/automations/')({
	component: Automations,
})

function Automations() {
	const tableColumns: TableProps<Workflow>['columns'] = []

	return (
		<PageContainer>
			<Table<Workflow>
				title="Workflows"
				columns={tableColumns}
				route="/apps/automations/"
				queryKeys={['getWorkflows']}
				paginateUrl="/automations/all"
				defaultEmptyStateName="automations"
				addButtonLink="/apps/automations/designer"
				description="Create and manage all automations and workflows"
			/>
		</PageContainer>
	)
}
