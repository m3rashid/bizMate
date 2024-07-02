import { flushSync } from 'react-dom'

export function generateRandomString(len = 10) {
	return Math.random()
		.toString(36)
		.substring(2, len + 2)
}

export function toSentenceCase(str: string | string[]) {
	if (typeof str === 'string') return str.charAt(0).toUpperCase() + str.slice(1)
	return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

export function camelCaseToSentenceCase(str: string) {
	const result = str.replace(/([A-Z])/g, ' $1')
	return toSentenceCase(result)
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

/**
 * @param cb Function to be executed in the view transition
 * @description Function to handle view transitions
 * View transitions are used to animate the transition between two views and should be used when the transition between two views is not smooth
 */
export function handleViewTransition(cb: () => void) {
	document.startViewTransition(() => {
		flushSync(cb)
	})
}

export function shuffleArray(array: Array<any>) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

export const mimeTypes = {
	pdf: 'application/pdf',
	image: 'image/*',
}

export function isUuid(id: string) {
	const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
	return regex.test(id)
}
