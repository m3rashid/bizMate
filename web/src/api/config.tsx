import { QueryClient } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';

type OtherRequestOptions = {
	baseUrl?: string;
	downloadableContent?: { fileName: string };
};

export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;
export async function apiClient<ResponseType = any>(endpoint: string, requestOptions?: AxiosRequestConfig, otherOptions?: OtherRequestOptions) {
	try {
		const res = await axios<ResponseType>({
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

export function getQueryClientForServer() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}
