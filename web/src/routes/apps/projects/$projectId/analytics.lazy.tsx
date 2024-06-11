import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/apps/projects/$projectId/analytics')({
	component: ProjectAnalytics,
})

function ProjectAnalytics() {
	return <div>Hello /apps/projects/$projectId/analytics!</div>
}
