'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cache, ReactNode } from 'react';

export const getQueryClient = cache(() => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
			},
		},
	});
});

export function ApiProvider(props: { children: ReactNode }) {
	const queryClient = getQueryClient();
	return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
