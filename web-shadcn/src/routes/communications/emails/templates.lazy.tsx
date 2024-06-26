import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/communications/emails/templates')({
	component: () => <div>Hello /communications/emails/templates!</div>,
})
