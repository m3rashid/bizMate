import PageContainer from '@components/pageContainer'
import StripePayment from '@components/payments/stripe'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/payment')({
	component: Payments,
})

function Payments() {
	return (
		<PageContainer>
			<StripePayment />
		</PageContainer>
	)
}
