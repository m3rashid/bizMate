import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forms/$formId/responses')({
  component: () => <div>Hello /forms/$formId/responses!</div>
})