import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/settings')({
	component: () => <div>Hello /app/settings!</div>,
})
