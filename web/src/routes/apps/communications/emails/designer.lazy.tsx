import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/apps/communications/emails/designer')({
	component: EmailDesigner,
})

function EmailDesigner() {
	return <div>Hello /apps/communication/emails/designer!</div>
}
