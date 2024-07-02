import apiClient from '@api/client'
import { PageLoader } from '@components/lib/loader'
// import { loadStripe } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'

// import { useState } from 'react'

function StripePayment() {
	// const [stripePromise, setStripePromise] = useState(null)

	const { data: stripeConfig, isPending } = useQuery({
		retry: false,
		queryKey: ['stripeConfig'],
		queryFn: () => apiClient(`/payments/stripe/config`),
	})

	if (isPending) return <PageLoader />
	console.log(stripeConfig)
	return (
		<div>
			<h1>Stripe Payment</h1>
		</div>
	)
}

export default StripePayment
