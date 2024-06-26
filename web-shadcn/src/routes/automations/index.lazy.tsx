import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/automations/')({
	component: () => <div>Hello /automations/!</div>,
})
