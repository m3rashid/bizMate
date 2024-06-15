import { createFileRoute } from '@tanstack/react-router'

import { PageSearchParams } from '../../../../types'
import PageContainer from '../../../../components/pageContainer'

export const Route = createFileRoute('/apps/communications/emails/')({
	component: Emails,
	validateSearch: (search: Record<string, unknown>): PageSearchParams => ({ page: Number(search?.page ?? 1) }),
})

function Emails() {
	return <PageContainer></PageContainer>
}
