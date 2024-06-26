import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/communications/emails/schedules')({
	component: () => <div>Hello /communications/emails/schedules!</div>,
})
