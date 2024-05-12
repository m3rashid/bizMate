import { createFileRoute } from '@tanstack/react-router'

import { FormDesignerProvider } from '../../../hooks/formDesigner'
import FormDesignerComponent from '../../../components/formDesigner'

export const Route = createFileRoute('/apps/forms/designer')({
	component: FormDesigner,
})

function FormDesigner() {
	return (
		<FormDesignerProvider>
			<FormDesignerComponent />
		</FormDesignerProvider>
	)
}
