import apiClient from '@api/client'
import Button from '@components/lib/button'
import Input from '@components/lib/input'
import { Loader } from '@components/lib/loader'
import PhoneNumberInput from '@components/lib/phoneNumberInput'
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon'
import { useAuthState } from '@hooks/auth'
import { usePopups } from '@hooks/popups'
import { useMutation } from '@tanstack/react-query'
import { FormEvent } from 'react'

type LoginBody = { email: string; password: string }
type RegisterBody = LoginBody & { name: string; phone?: string }

export type LoginWithCredentialsProps = {
	type: 'login' | 'register'
	onSuccess?: () => void
	onFailure?: () => void
}

function LoginWithCredentials(props: LoginWithCredentialsProps) {
	const { setAuth } = useAuthState()
	const { addMessagePopup } = usePopups()

	function onSuccess(res: any) {
		console.log(res)
		localStorage.setItem('token', res.data.token)
		addMessagePopup({ id: 'Logged in Successfully', type: 'success', message: 'Logged in successfully' })
		setAuth((prev) => ({ ...prev, isAuthenticated: true, user: res.data.user }))
		if (props.onSuccess) props.onSuccess()
	}

	function onError(err: any) {
		console.log(err)
		addMessagePopup({ id: 'Login Failed', type: 'error', message: 'Login failed. Please check your credentials and try again.' })
		if (props.onFailure) props.onFailure()
	}

	const { isPending: isLoginPending, mutate: handleLogin } = useMutation({
		mutationKey: ['login'],
		mutationFn: async (body: LoginBody) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
	})

	const { isPending: isRegisterPending, mutate: handleRegister } = useMutation({
		mutationKey: ['register'],
		mutationFn: async (body: RegisterBody) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
	})

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		if (props.type === 'login') handleLogin({ email: formData.email, password: formData.password }, { onError, onSuccess })
		else handleRegister({ name: formData.name, phone: formData.phone, email: formData.email, password: formData.password }, { onError, onSuccess })
	}

	return (
		<form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
			{props.type === 'register' ? <Input name="name" type="name" label="Name" placeholder="BizMate Hero" required /> : null}

			<Input name="email" type="email" label="Email" placeholder="rashid@bizmate.com" required descriptionText="We will never share your email." />

			{props.type === 'register' ? <PhoneNumberInput name="phone" label="Phone" /> : null}

			<Input placeholder="Shhh..." required name="password" type="password" label="Password" />

			<Button
				type="submit"
				className="mt-2"
				LeftIcon={<LockClosedIcon className="h-5 w-5" />}
				label={props.type === 'register' ? 'Register' : 'Login'}
				{...(isLoginPending || isRegisterPending ? { RightIcon: <Loader /> } : {})}
			/>
		</form>
	)
}

export default LoginWithCredentials
