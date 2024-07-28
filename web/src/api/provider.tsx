'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, Suspense } from 'react';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
});

export function ApiProvider(props: { children: ReactNode }) {
	return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
