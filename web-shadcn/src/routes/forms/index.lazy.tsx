import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forms/')({
	component: () => <div>Hello /forms/!</div>,
})
