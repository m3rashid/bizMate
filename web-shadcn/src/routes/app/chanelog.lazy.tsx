import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/chanelog')({
	component: () => <div>Hello /app/chanelogs!</div>,
})
