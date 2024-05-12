import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/forms/$formId/reports')({
	component: FormReports,
})

function FormReports() {
	const { formId } = useParams({ from: '/apps/forms/$formId/reports' })
	return <div></div>
}
