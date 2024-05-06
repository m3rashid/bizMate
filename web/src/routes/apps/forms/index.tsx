import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/forms/')({
	component: () => <div>Hello /apps/forms/!</div>,
})
