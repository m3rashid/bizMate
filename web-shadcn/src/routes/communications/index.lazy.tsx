import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/communications/')({
  component: () => <div>Hello /communications/!</div>
})