type OtherRequestOptions = {
	baseUrl?: string;
	downloadableContent?: { fileName: string };
};

async function defaultSuccessHandler(res: Response, options?: OtherRequestOptions) {
	try {
		let data;
		if (!res.ok) {
			data = await res.json();
			const error = (data && data) || res.status;
			return Promise.reject(error);
		}

		const contentType = res.headers.get('content-type');
		if (options?.downloadableContent) {
			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = options.downloadableContent.fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
		} else {
			if (contentType && contentType.indexOf('application/json') !== -1) data = await res.json();
			else data = await res.text();
		}
		return data;
	} catch (err: unknown) {
		return Promise.reject(err);
	}
}

function defaultErrorHandler(error: unknown) {
	throw error;
}

export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API;
export async function apiClient(endpoint: string, requestOptions?: RequestInit, otherOptions?: OtherRequestOptions) {
	return fetch((otherOptions?.baseUrl ?? baseUrl) + endpoint, {
		...(requestOptions || {}),
		headers: {
			method: 'GET',
			'Content-Type': 'application/json',
			...(requestOptions?.headers || {}),
		},
	})
		.then((res) => defaultSuccessHandler(res, otherOptions))
		.catch(defaultErrorHandler);
}
