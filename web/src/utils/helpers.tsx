export function generateRandomString(len = 10) {
	return Math.random()
		.toString(36)
		.substring(2, len + 2)
}

export function capitalizeFirstLetter(str: string | string[]) {
	if (typeof str === 'string') return str.charAt(0).toUpperCase() + str.slice(1)
	return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

export function camelCaseToSentenceCase(str: string) {
	const result = str.replace(/([A-Z])/g, ' $1')
	return capitalizeFirstLetter(result)
}

/**
 * @returns Object with keys that are not in the keys array
 */
export function filterBykeys(obj: Record<string, any>, keys: string[]): Record<string, any> {
	return Object.keys(obj).reduce((acc, key) => ({ ...acc, ...(!keys.includes(key) ? { [key]: obj[key] } : {}) }), {})
}

export function getUniqueObjectsByKey<T extends Record<string, any>>(arr: Array<T>, key: string) {
	const keyMap = new Map<string, boolean>()
	return arr.filter((obj) => {
		if (keyMap.has(obj[key])) return false
		keyMap.set(obj[key], true)
		return true
	})
}

export function safeJsonParse(content: string, defaultReturn: any, validations?: (res: any) => boolean) {
	try {
		const res = JSON.parse(content)
		if (validations && !validations(res)) throw new Error('Validations failed')
		return res
	} catch (err: any) {
		return defaultReturn
	}
}
