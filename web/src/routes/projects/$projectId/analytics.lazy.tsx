import PageContainer from '../../../components/pageContainer'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/projects/$projectId/analytics')({
	component: ProjectAnalytics,
})

function ProjectAnalytics() {
	const { projectId } = useParams({ from: '/projects/$projectId/analytics' })
	console.log(projectId)

	return (
		<PageContainer>
			<div>Hello /projects/$projectId/analytics!</div>
		</PageContainer>
	)
}
