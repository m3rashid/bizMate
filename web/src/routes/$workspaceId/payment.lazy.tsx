import PageContainer from '@components/pageContainer'
import StripePayment from '@components/payments/stripe'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/$workspaceId/payment')({
	component: Payments,
})

function Payments() {
	const { workspaceId } = useParams({ from: '/$workspaceId/payment' })
	return (
		<PageContainer workspaceId={workspaceId}>
			<StripePayment />
		</PageContainer>
	)
}
