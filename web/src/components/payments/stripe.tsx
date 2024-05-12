import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'

import apiClient from '../../api/client'
import { PageLoader } from '../lib/loader'

function StripePayment() {
	const [stripePromise, setStripePromise] = useState(null)

	const { data: stripeConfig, isPending } = useQuery({
		retry: false,
		queryKey: ['stripeConfig'],
		queryFn: () => apiClient('/payments/stripe/config', { method: 'GET' }),
	})

	if (isPending) return <PageLoader />

	return (
		<div>
			<h1>Stripe Payment</h1>
		</div>
	)
}

export default StripePayment
