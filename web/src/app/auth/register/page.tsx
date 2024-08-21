import { AuthRoot } from '../components/root';
import { getSessionCookie } from '@/actions/auth';
import { redirect } from 'next/navigation';

export default async function Register() {
	const sessionCookie = await getSessionCookie();

	if (sessionCookie) {
		// TODO: handle redirect
		redirect('/');
	}

	return <AuthRoot type='register' />;
}
