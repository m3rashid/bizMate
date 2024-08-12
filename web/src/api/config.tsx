import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { cache } from 'react';

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

type OtherRequestOptions = {
	baseUrl?: string;
	downloadableContent?: { fileName: string };
};

export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;
export async function apiClient(endpoint: string, requestOptions?: AxiosRequestConfig, otherOptions?: OtherRequestOptions) {
	try {
		const res = await axios({
			baseURL: otherOptions?.baseUrl ?? baseUrl,
			url: endpoint,
			withCredentials: true,
			...(requestOptions || {}),
			headers: {
				method: 'GET',
				'Content-Type': 'application/json',
				...(requestOptions?.headers || {}),
			},
		});
		return res.data;
	} catch (err: any) {
		return null;
	}
}
