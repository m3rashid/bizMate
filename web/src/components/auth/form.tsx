'use client';

import { Loader } from '../lib/loaders';
import { baseUrl } from '@/api/config';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { PhoneNumberInput } from '@/components/lib/phoneNumberInput';
import { usePopups } from '@/hooks/popups';
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export type CredentialsAuthFormProps = {
	type: 'login' | 'register';
};

export function CredentialsAuthForm(props: CredentialsAuthFormProps) {
	const { addMessagePopup } = usePopups();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		e.stopPropagation();
		setLoading(true);
		try {
			const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
			const res = await fetch(baseUrl + '/auth/login', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(formData),
				headers: { 'Content-Type': 'application/json' },
			});
			if (!res.ok) throw new Error('Failed to login');
			const _data = await res.json();

			addMessagePopup({
				type: 'success',
				id: 'loginSuccess',
				message: props.type === 'login' ? 'Successfully Logged in' : 'Successfully Created account',
			});
			// TODO: handle redirects
			router.replace('/auth/choose-workspace');
		} catch (err: any) {
			console.log(err);
			addMessagePopup({ id: 'loginError', message: props.type === 'login' ? 'Login Failed' : 'Create account failed', type: 'error' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className='flex w-full flex-col gap-4' onSubmit={onSubmit}>
			{props.type === 'register' ? <Input name='name' type='name' label='Name' placeholder='BizMate Hero' required /> : null}

			<Input name='email' type='email' label='Email' placeholder='rashid@bizmate.com' required descriptionText='We will never share your email.' />

			{props.type === 'register' ? <PhoneNumberInput name='phone' label='Phone' /> : null}

			<Input placeholder='Shhh...' required name='password' type='password' label='Password' />

			<Button
				type='submit'
				className='mt-2'
				{...(loading ? { RightIcon: <Loader /> } : {})}
				LeftIcon={<LockClosedIcon className='h-5 w-5' />}
				label={props.type === 'register' ? 'Register' : 'Login'}
			/>
		</form>
	);
}
