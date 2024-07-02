import PageContainer from '@components/pageContainer'
import { PageSearchParams } from '@mytypes'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/$workspaceId/communications/emails/')({
	component: Emails,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function Emails() {
	const { workspaceId } = useParams({ from: '/$workspaceId/communications/emails/' })
	return <PageContainer workspaceId={workspaceId}></PageContainer>
}
