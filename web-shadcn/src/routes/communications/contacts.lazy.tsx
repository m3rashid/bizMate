import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/communications/contacts')({
	component: () => <div>Hello /communications/contacts!</div>,
})
