import { createFileRoute } from '@tanstack/react-router'
import PageContainer from '../../../../components/pageContainer'
import Table, { PageSearchParams, TableProps } from '../../../../components/lib/table'
import { EmailTemplate } from '../../../../types'
import dayjs from 'dayjs'

export const Route = createFileRoute('/apps/communications/emails/templates')({
	component: EmailTemplates,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

// list of email templates
function EmailTemplates() {
	const tableColumns: TableProps<EmailTemplate>['columns'] = [
		{ title: 'Title', dataKey: 'title' },
		{
			title: 'Created At',
			dataKey: 'createdAt',
			render: ({ row }) => dayjs(row.createdAt).format('DD MMM, YYYY - HH:mm A'),
		},
		{ title: 'Template', dataKey: 'bodyTemplate', render: ({ row }) => <div></div> },
	]

	return (
		<PageContainer>
			<Table<EmailTemplate>
				columns={tableColumns}
				title="Email Templates"
				queryKeys={['getEmailTemplates']}
				paginateUrl="/email-templates/all"
				route="/apps/communications/emails/"
				defaultEmptyStateName="email Templates"
				addButtonProps={{ label: 'New Email Template' }}
				description="Create and manage all email template"
				addButtonLink="/apps/communications/emails/designer"
			/>
		</PageContainer>
	)
}
