import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forms/$formId/fill')({
  component: () => <div>Hello /forms/$formId/fill!</div>
})