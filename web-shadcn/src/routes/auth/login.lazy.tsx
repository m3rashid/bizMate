import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/login')({
	component: () => <div>Hello /auth/login!</div>,
})
