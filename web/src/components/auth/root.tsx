import { CredentialsAuthForm, CredentialsAuthFormProps } from './form';
import { BrandLogo } from '@/components/lib/brandLogo';
import { Link } from 'next-view-transitions';

export type AuthRootProps = {
	type: CredentialsAuthFormProps['type'];
};

export function AuthRoot(props: AuthRootProps) {
	return (
		<div className='flex h-full items-center justify-center bg-pageBg'>
			<div className='relative flex w-full max-w-96 flex-col gap-4 rounded-lg bg-white px-6 pb-12 pt-[90px] shadow-lg'>
				<BrandLogo className='absolute -top-6 left-6' />
				<h2 className='absolute left-[132px] top-6 text-xl font-semibold'>
					{props.type === 'login' ? 'Login to Continue' : 'Register to get Started'}
				</h2>

				<CredentialsAuthForm type={props.type} />
				<Link
					href={props.type === 'login' ? '/auth/register' : '/auth/login'}
					className='mb-1 cursor-pointer text-center text-sm text-primary hover:text-danger'
				>
					{props.type === 'login' ? "Don't have an account? Register Instead" : 'Already have an account? Login Instead'}
				</Link>

				<div className='flex w-full flex-col'>
					<p className='mb-1 text-center text-sm text-gray-500'>Login in with a different method</p>
					{/* <LoginWithGoogle /> */}
				</div>
			</div>
		</div>
	);
}
