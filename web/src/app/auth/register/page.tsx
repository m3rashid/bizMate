import { getSession } from '@/actions/auth';
import { AuthRoot } from '@/components/auth/root';
import { redirect } from 'next/navigation';

export default async function Register() {
	const session = await getSession();

	if (session.isAuthenticated) {
		// TODO: handle redirect
		redirect('/');
	}

	return <AuthRoot type='register' />;
}
