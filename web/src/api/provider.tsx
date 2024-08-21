'use client';

import { getQueryClientForServer } from './config';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren } from 'react';

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		// With SSR, we usually want to set some default staleTime above 0 to avoid refetching immediately on the client
		return getQueryClientForServer();
	} else {
		// Browser: make a new query client if we don't already have one
		// This is very important, so we don't re-make a new client if React suspends during the initial render.
		// This may not be needed if we have a suspense boundary BELOW the creation of the query client
		if (!browserQueryClient) {
			browserQueryClient = new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
						refetchOnMount: false,
						refetchOnReconnect: false,
						refetchOnWindowFocus: false,
					},
				},
			});
		}
		return browserQueryClient;
	}
}

export default function TanstackQueryProvider(props: PropsWithChildren) {
	// NOTE: Avoid useState when initializing the query client if you don't
	//       have a suspense boundary between this and the code that may
	//       suspend because React will throw away the client on the initial
	//       render if it suspends and there is no boundary
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
