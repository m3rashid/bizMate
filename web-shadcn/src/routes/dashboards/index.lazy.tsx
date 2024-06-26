import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboards/')({
  component: () => <div>Hello /dashboards/!</div>
})