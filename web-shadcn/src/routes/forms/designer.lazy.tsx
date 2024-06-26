import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forms/designer')({
	component: () => <div>Hello /forms/designer!</div>,
})
