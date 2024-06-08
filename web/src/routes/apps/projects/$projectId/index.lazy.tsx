import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/apps/projects/$projectId/')({
	component: ProjectDetails,
})

function ProjectDetails() {
	return <div>Hello /apps/projects/$projectId/!</div>
}
