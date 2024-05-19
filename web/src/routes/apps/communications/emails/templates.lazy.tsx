import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/apps/communications/emails/templates')({
	component: EmailTemplates,
})

// list of email templates
function EmailTemplates() {
	return <div>Hello /apps/communication/emails/templates!</div>
}
