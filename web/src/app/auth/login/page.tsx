import { AuthRoot } from '../components/root';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';

export default async function LoginPage() {
	return <AuthRoot type='login' />;
}

export const metadata: Metadata = createDefaultMeta('Login', 'login to your account on Bizmate');
