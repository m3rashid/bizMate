import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, Suspense, lazy, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const ReactQueryDevtoolsProduction = lazy(() =>
	import('@tanstack/react-query-devtools/production').then((d) => ({
		default: d.ReactQueryDevtools,
	})),
)

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
})

function ApiProvider(props: { children: ReactNode }) {
	const [showDevtools, setShowDevtools] = useState(false)
	useEffect(() => {
		// @ts-expect-error - This is a devtools hook
		window.toggleDevtools = () => setShowDevtools((old) => !old)
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			{props.children}

			<ReactQueryDevtools initialIsOpen={false} />
			{showDevtools && (
				<Suspense fallback={null}>
					<ReactQueryDevtoolsProduction />
				</Suspense>
			)}
		</QueryClientProvider>
	)
}

export default ApiProvider
