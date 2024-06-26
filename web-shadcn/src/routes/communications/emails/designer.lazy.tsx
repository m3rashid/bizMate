import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/communications/emails/designer')({
	component: () => <div>Hello /communications/emails/designer!</div>,
})
