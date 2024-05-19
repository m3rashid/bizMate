import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'

import { Workflow } from '../../../types'
import apiClient from '../../../api/client'
import { PageLoader } from '../../../components/lib/loader'
import PageContainer from '../../../components/pageContainer'
import Table, { TableProps } from '../../../components/lib/table'

export const Route = createLazyFileRoute('/apps/automations/')({
	component: Automations,
})

function Automations() {
	const { data, isPending } = useQuery({ queryKey: ['getWorkflows'], queryFn: () => apiClient('/automations/all') })

	const tableColumns: TableProps<Workflow>['columns'] = []

	return (
		<PageContainer>
			{isPending ? (
				<PageLoader />
			) : (
				<Table<Workflow>
					title="Workflows"
					description="Create and manage all automations and workflows"
					data={data?.docs || []}
					addButtonLink="/apps/automations/designer"
					columns={tableColumns}
					defaultEmptyStateName="automations"
				/>
			)}
		</PageContainer>
	)
}
