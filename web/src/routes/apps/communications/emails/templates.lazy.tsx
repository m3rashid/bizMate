import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/apps/communications/emails/templates')({
	component: EmailTemplates,
})

function EmailTemplates() {
	return <div>Hello /apps/communication/emails/templates!</div>
}
