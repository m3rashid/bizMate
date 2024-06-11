import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import PageContainer from '../../../../components/pageContainer'

export const Route = createLazyFileRoute('/apps/projects/$projectId/analytics')({
	component: ProjectAnalytics,
})

function ProjectAnalytics() {
	const { projectId } = useParams({ from: '/apps/projects/$projectId/analytics' })

	return (
		<PageContainer>
			<div>Hello /apps/projects/$projectId/analytics!</div>
		</PageContainer>
	)
}
