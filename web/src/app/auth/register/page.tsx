import { AuthRoot } from '../components/root';
import { getSessionCookie } from '@/actions/auth';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function Register() {
	const sessionCookie = await getSessionCookie();

	if (sessionCookie) {
		// TODO: handle redirect
		redirect('/');
	}

	return <AuthRoot type='register' />;
}

export const metadata: Metadata = createDefaultMeta('Register', 'Register for Bizmate');
