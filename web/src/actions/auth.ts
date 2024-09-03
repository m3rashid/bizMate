'use server';

import { CookieUser } from '@/utils/types';
import { cookies } from 'next/headers';

export async function getSessionCookie() {
	const cookie = cookies().get('token');
	return cookie?.value;
}

export async function getUserFromCookie(): Promise<CookieUser | null> {
	const token = await getSessionCookie();
	if (!token) return null;
	const base64Url = token.split(' ')[1].split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64));
	return JSON.parse(jsonPayload);
}

export async function logout() {
	cookies().delete('token');
}
