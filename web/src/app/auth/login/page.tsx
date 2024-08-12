import { getSessionCookie } from '@/actions/auth';
import { AuthRoot } from '@/components/auth/root';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
	const sessionCookie = await getSessionCookie();

	if (sessionCookie) {
		// TODO: handle redirect
		redirect('/');
	}

	return <AuthRoot type='login' />;
}
