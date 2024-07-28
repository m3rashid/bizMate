'use client';

import { loginAction, registerAction } from '@/actions/auth';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { PhoneNumberInput } from '@/components/lib/phoneNumberInput';
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon';
import { useFormState } from 'react-dom';

export type CredentialsAuthFormProps = {
	type: 'login' | 'register';
};

const credentialActions = { login: loginAction, register: registerAction } as const;

export function CredentialsAuthForm(props: CredentialsAuthFormProps) {
	const [state, formAction] = useFormState<{ error: string }, FormData>(credentialActions[props.type], { error: '' });

	return (
		<form className='flex w-full flex-col gap-4' action={formAction}>
			{props.type === 'register' ? <Input name='name' type='name' label='Name' placeholder='BizMate Hero' required /> : null}

			<Input name='email' type='email' label='Email' placeholder='rashid@bizmate.com' required descriptionText='We will never share your email.' />

			{props.type === 'register' ? <PhoneNumberInput name='phone' label='Phone' /> : null}

			<Input placeholder='Shhh...' required name='password' type='password' label='Password' />

			<Button
				type='submit'
				className='mt-2'
				LeftIcon={<LockClosedIcon className='h-5 w-5' />}
				label={props.type === 'register' ? 'Register' : 'Login'}
				// {...(isLoginPending || isRegisterPending ? { RightIcon: <Loader /> } : {})}
			/>
			{state.error ? <p>{state.error}</p> : null}
		</form>
	);
}
