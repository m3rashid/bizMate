import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/signup')({
	component: () => <div>Hello /auth/signup!</div>,
})
