import { createLazyFileRoute } from '@tanstack/react-router'

import StripePayment from '../components/payments/stripe'
import PageContainer from '../components/pageContainer'

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
