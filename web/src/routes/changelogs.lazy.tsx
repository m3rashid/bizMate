import apiClient from '@api/client'
import Button from '@components/lib/button'
import PageContainer from '@components/pageContainer'
import { Changelog, PaginationResponse } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/changelogs')({
	component: Changelogs,
})

function Changelogs() {
	const { t } = useTranslation()
	const [page, setPage] = useState(1)
	const { data } = useQuery<PaginationResponse<Changelog>>({
		queryKey: ['getChangelogs', page],
		queryFn: () => apiClient(`/host/changelogs/all?page=${page}&limit=3`),
	})

	return (
		<PageContainer workspaceId="">
			<Button disabled={!data?.hasNextPage} onClick={() => setPage((p) => p + 1)}>
				{t('Earlier')}
			</Button>
		</PageContainer>
	)
}
