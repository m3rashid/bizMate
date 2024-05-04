async function defaultSuccessHandler(res: Response) {
	try {
		const contentType = res.headers.get('content-type')
		let data
		if (contentType && contentType.indexOf('application/json') !== -1) {
			data = await res.json()
		} else {
			data = await res.text()
		}

		if (!res.ok) {
			const error = (data && data) || res.status
			return Promise.reject(error)
		}

		return data
	} catch (err: unknown) {
		return Promise.reject(err)
	}
}

function defaultErrorHandler(error: unknown) {
	throw error
}

export const baseUrl = import.meta.env.VITE_API_BASE_URL
async function apiClient(endpoint: string, requestOptions?: RequestInit) {
	return fetch(baseUrl + endpoint, {
		...(requestOptions || {}),
		headers: {
			method: 'POST',
			'Content-Type': 'application/json',
			...(requestOptions?.headers || {}),
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
		.then(defaultSuccessHandler)
		.catch(defaultErrorHandler)
}

export default apiClient
