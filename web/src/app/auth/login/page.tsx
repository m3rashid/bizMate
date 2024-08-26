import { AuthRoot } from '../components/root';
import { getSessionCookie } from '@/actions/auth';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
	const sessionCookie = await getSessionCookie();

	if (sessionCookie) {
		// TODO: handle redirect
		redirect('/auth/choose-workspace');
	}

	return <AuthRoot type='login' />;
}

export const metadata: Metadata = createDefaultMeta('Login', 'login to your account on Bizmate');
