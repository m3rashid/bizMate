import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/projects/')({
	component: () => <div>Hello /projects/!</div>,
})
