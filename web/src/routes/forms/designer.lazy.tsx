import FormDesignerComponent from '../../components/formDesigner'
import PageContainer from '../../components/pageContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forms/designer')({
	component: FormDesigner,
})

function FormDesigner() {
	return (
		<PageContainer bodyClassName="p-0 sm:p-0">
			<FormDesignerComponent />
		</PageContainer>
	)
}
