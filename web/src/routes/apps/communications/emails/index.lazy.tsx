import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/apps/communications/emails/')({
	component: Emails,
})

function Emails() {
	return <div>Hello /apps/communication/emails/!</div>
}
