import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/forms/$formId/analytics')({
  component: () => <div>Hello /forms/$formId/analytics!</div>
})