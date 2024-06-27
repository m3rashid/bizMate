import FormDesignerComponent from '../../components/formDesigner'
import { FormDesignerProvider } from '../../hooks/formDesigner'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forms/designer')({
	component: FormDesigner,
})

function FormDesigner() {
	return (
		<FormDesignerProvider>
			<FormDesignerComponent />
		</FormDesignerProvider>
	)
}
