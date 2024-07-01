import Table, { TableProps } from '@components/lib/table'
import PageContainer from '@components/pageContainer'
import { EmailTemplate, PageSearchParams } from '@mytypes'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const Route = createFileRoute('/$workspaceId/communications/emails/templates')({
	component: EmailTemplates,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function EmailTemplates() {
	const tableColumns: TableProps<EmailTemplate>['columns'] = [
		{ title: 'Title', dataKey: 'title' },
		{ title: 'Description', dataKey: 'description' },
		{ title: 'Created At', dataKey: 'createdAt', render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A') },
	]

	return (
		<PageContainer>
			<Table<EmailTemplate>
				columns={tableColumns}
				title="Email Templates"
				queryKeys={['getEmailTemplates']}
				paginateUrl="/email-templates/all"
				defaultEmptyStateName="email Templates"
				addButtonProps={{ label: 'New Email Template' }}
				description="Create and manage all email template"
				addButtonLink="/communications/emails/designer"
			/>
		</PageContainer>
	)
}
