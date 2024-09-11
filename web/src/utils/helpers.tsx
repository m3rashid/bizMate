import tailwindConfig from '../../tailwind.config';
import { ApiResponse, Workspace } from './types';
import { apiClient } from '@/api/config';
import { type ClassValue, clsx } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateRandomString(len = 10) {
	return Math.random()
		.toString(36)
		.substring(2, len + 2);
}

export function toSentenceCase(str: string | string[]) {
	if (typeof str === 'string') return str.charAt(0).toUpperCase() + str.slice(1);
	return str.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

export function camelCaseToSentenceCase(str: string) {
	const result = str.replace(/([A-Z])/g, ' $1');
	return toSentenceCase(result);
}

export function snakeCaseToSentenceCase(str: string) {
	const result = str.replace(/_/g, ' ');
	return toSentenceCase(result);
}

export function filterBykeys(obj: Record<string, any>, keys: string[]): Record<string, any> {
	return Object.keys(obj).reduce((acc, key) => ({ ...acc, ...(!keys.includes(key) ? { [key]: obj[key] } : {}) }), {});
}

export function getUniqueObjectsByKey<T extends Record<string, any>>(arr: Array<T>, key: string) {
	const keyMap = new Map<string, boolean>();
	return arr.filter((obj) => {
		if (keyMap.has(obj[key])) return false;
		keyMap.set(obj[key], true);
		return true;
	});
}

export function safeJsonParse(content: string, defaultReturn: any, validations?: (res: any) => boolean) {
	try {
		const res = JSON.parse(content);
		if (validations && !validations(res)) throw new Error('Validations failed');
		return res;
	} catch (err: any) {
		return defaultReturn;
	}
}

export function safeParseNumber(num: string | undefined, defaultReturn: number) {
	try {
		if (!num) return defaultReturn;
		const res = parseInt(num, 10);
		if (isNaN(res)) throw new Error('NaN');
		return res;
	} catch (err) {
		return defaultReturn;
	}
}

export function shuffleArray(arr: Array<any>) {
	const newArr = [...arr];
	return newArr.sort(() => Math.random() - 0.5);
}

export const mimeTypes = {
	pdf: 'application/pdf',
	image: 'image/*',
};

export function isUuid(id: string) {
	const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
	return regex.test(id);
}

export function getTailwindColor(name: string) {
	const colors: any = tailwindConfig.theme?.extend?.colors;
	return colors[name];
}

export async function checkWorkspace(workspaceId: string) {
	const res = await apiClient<ApiResponse<Workspace>>(`/auth/${workspaceId}/check-workspace`);
	return res;
}

function tokenTimeToDate(tokenTime: number) {
	const date = new Date(0);
	date.setUTCSeconds(tokenTime);
	return date;
}

export function sessionTokenExpired(sessionCookie: string) {
	try {
		const token = sessionCookie.split('Bearer ')[1];
		const tokenPayload = token.split('.')[1];
		const payload = JSON.parse(atob(tokenPayload));
		const tokenTime = tokenTimeToDate(payload.exp);
		const currentTime = new Date();
		return currentTime > tokenTime;
	} catch (err) {
		return true;
	}
}

export function createDefaultMeta(_title: string, _description?: string): Metadata {
	const title = `${_title} - Bizmate`;
	const description = _description || 'Manage your organization with confidence';
	return {
		title,
		description,
		robots: 'index, follow',
		// icons: [
		// 	{ rel: 'icon', url: '/logo.png', type: 'image/png' },
		// 	{ rel: 'apple', url: '/logo.png', type: 'image/png' },
		// ],
		// openGraph: {
		// 	title,
		// 	description,
		// 	images: [{ url: '/logo.png', alt: 'Bizmate Logo', width: 100, height: 100, type: 'image/png' }],
		// },
		// twitter: {
		// 	title,
		// 	description,
		// 	creator: '@m3_rashid',
		// 	images: [{ url: '/logo.png', alt: 'Bizmate Logo', width: 100, height: 100, type: 'image/png' }],
		// },
	};
}
