'use client';

import { baseUrl } from '@/api/config';
import { Button } from '@/components/lib/button';
import { Input } from '@/components/lib/input';
import { PingLoader } from '@/components/lib/loaders';
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
			const res = await fetch(baseUrl + (props.type === 'login' ? '/auth/login' : '/auth/register'), {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(formData),
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await res.json();
			console.log(data);
			if (data && data.success) {
				addMessagePopup({
					id: 'login',
					type: 'success',
					message: props.type === 'login' ? 'Successfully Logged in' : 'Successfully Created account',
				});
				router.replace('/auth/choose-workspace');
			} else throw new Error(data.message || ('Failed to ' + props.type === 'login' ? 'login' : 'create account'));
			// TODO: handle redirects
		} catch (err: any) {
			console.log('catch err: ', err);
			addMessagePopup({
				id: 'login',
				type: 'error',
				message: err.message || props.type === 'login' ? ' Login failed' : 'Create account failed',
			});
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
				{...(loading ? { RightIcon: <PingLoader /> } : {})}
				LeftIcon={<LockClosedIcon className='h-5 w-5' />}
				label={props.type === 'register' ? 'Register' : 'Login'}
			/>
		</form>
	);
}
