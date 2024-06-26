import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forms/$formId/preview')({
	component: () => <div>Hello /forms/$formId/preview!</div>,
})
