'use server';

import { apiClient } from '@/api/config';
import { User } from '@/utils/types';
import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type SessionData = { user: User | null; token: string; isAuthenticated: boolean };
const sessionOptions: SessionOptions = {
	password: process.env.AUTH_SECRET_KEY!,
	cookieName: 'bizmate-auth-session',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production', // HTTPS only in production
	},
};

export async function getSession() {
	const session = await getIronSession<SessionData>(cookies(), sessionOptions);
	// TODO: may check other things with session
	return session;
}

export async function loginAction(state: { error: string }, formData: FormData): Promise<{ error: string }> {
	try {
		const session = await getSession();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		if (!email || !password) throw new Error('Email and password are required');

		const res = await apiClient('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
		console.log('loginRes', JSON.stringify(res.data));
		session.user = res.data.user;
		session.token = res.data.token;
		session.isAuthenticated = !!res.data.user && !!res.data.token;
		await session.save();
		return { error: '' };
	} catch (err: any) {
		console.error('loginAction', err.message);
		return { error: err.message || 'Login failed, please try again later' };
	}
}

export async function registerAction(state: { error: string }, formData: FormData): Promise<{ error: string }> {
	return { error: '' };
}

export async function logoutAction() {
	const session = await getSession();
	session.destroy();
	redirect('/');
}
