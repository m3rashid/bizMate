import { AuthRoot } from '../components/root';
import { createDefaultMeta } from '@/utils/helpers';
import { Metadata } from 'next';

export default async function Register() {
	return <AuthRoot type='register' />;
}

export const metadata: Metadata = createDefaultMeta('Register', 'Register for Bizmate');
