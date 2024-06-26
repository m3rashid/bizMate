import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/designer')({
	component: () => <div>Hello /dashboards/designer!</div>,
})
