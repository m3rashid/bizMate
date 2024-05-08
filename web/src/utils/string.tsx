export function generateRandomString(len = 10) {
	return Math.random()
		.toString(36)
		.substring(2, len + 2)
}

export function capitalizeFirstLetter(str: string | string[]) {
	if (typeof str === 'string') return str.charAt(0).toUpperCase() + str.slice(1)
	return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
}

export function camelCaseToSentenceCase(str: string) {
	const result = str.replace(/([A-Z])/g, ' $1')
	return capitalizeFirstLetter(result)
}
