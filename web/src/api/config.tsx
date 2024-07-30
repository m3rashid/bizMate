type OtherRequestOptions = {
	baseUrl?: string;
	downloadableContent?: { fileName: string };
};

export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;
export async function apiClient(endpoint: string, requestOptions?: RequestInit, otherOptions?: OtherRequestOptions) {
	try {
		const res = await fetch((otherOptions?.baseUrl ?? baseUrl) + endpoint, {
			credentials: 'include',
			...(requestOptions || {}),
			headers: {
				method: 'GET',
				'Content-Type': 'application/json',
				...(requestOptions?.headers || {}),
			},
		});
		if (!res.ok) throw new Error('Failed to fetch');
		const data = await res.json();
		return data;
	} catch (err: any) {
		return null;
	}
}
