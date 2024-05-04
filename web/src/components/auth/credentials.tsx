import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon'

import Button from '../lib/button'
import Loader from '../lib/loader'
import TextInput from '../lib/textInput'
import apiClient from '../../api/client'
import { useAuth } from '../../hooks/auth'
import PhoneNumberInput from '../lib/phoneNumberInput'

type LoginBody = { email: string; password: string }
type RegisterBody = LoginBody & { name: string; phone?: string }
type Errors = RegisterBody

export type LoginWithCredentialsProps = {
	type: 'login' | 'register'
	onSuccess?: () => void
	onFailure?: () => void
}

function LoginWithCredentials(props: LoginWithCredentialsProps) {
	const { setAuth } = useAuth()
	const [errors, setErrors] = useState<Errors>({ email: '', password: '', name: '', phone: '' })
	const { isPending: isLoginPending, mutate: handleLogin } = useMutation({
		mutationKey: ['login'],
		mutationFn: async (body: LoginBody) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
	})

	const { isPending: isRegisterPending, mutate: handleRegister } = useMutation({
		mutationKey: ['register'],
		mutationFn: async (body: RegisterBody) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
	})

	function onSuccess(data: any) {
		localStorage.setItem('token', data.token)
		setAuth({ isAuthenticated: true, user: data.user })
		if (props.onSuccess) props.onSuccess()
	}

	function onError() {
		if (props.onFailure) props.onFailure()
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (props.type === 'login') {
			handleLogin({ email: formData.email, password: formData.password }, { onError, onSuccess })
		} else {
			handleRegister(
				{
					email: formData.email,
					password: formData.password,
					name: formData.name,
					phone: `${formData._ext} ${formData._phone}`,
				},
				{ onError, onSuccess },
			)
		}
	}

	return (
		<form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
			{props.type === 'register' ? (
				<TextInput name="name" type="name" label="Name" placeholder="BizMate Hero" required errorText={errors.name} />
			) : null}

			<TextInput
				name="email"
				type="email"
				label="Email"
				placeholder="rashid@bizmate.com"
				required
				descriptionText="We will never share your email."
				errorText={errors.email}
			/>

			{props.type === 'register' ? <PhoneNumberInput label="Phone" errorText={errors.phone} /> : null}

			<TextInput placeholder="Shhh..." required name="password" type="password" label="Password" errorText={errors.password} />

			<Button className="mt-2" leftIcon={LockClosedIcon} type="submit" {...(isLoginPending || isRegisterPending ? { rightIcon: Loader } : {})}>
				{props.type === 'register' ? 'Register' : 'Login'}
			</Button>
		</form>
	)
}

export default LoginWithCredentials
