import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/automations/designer')({
	component: () => <div>Hello /automations/designer!</div>,
})
