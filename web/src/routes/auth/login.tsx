import { useState } from 'react'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import LockClosedIcon from '@heroicons/react/20/solid/LockClosedIcon'

import Button from '../../components/lib/button'
import BrandLogo from '../../components/lib/brandLogo'
import TextInput from '../../components/lib/textInput'
import LoginWithGoogle from '../../components/loginWithGoogle'
import { useAuth } from '../../contexts/auth'

export const Route = createFileRoute('/auth/login')({ component: Login })

type LoginBody = { email: string; password: string }
type LoginErrors = LoginBody

function Login() {
	const { isAuthenticated } = useAuth()
	const [errors, setErrors] = useState<LoginErrors>({ email: '', password: '' })

	if (isAuthenticated) {
		return <Navigate to="/" /> // handle redirects and protected routes
	}

	return (
		<div className="flex h-screen items-center justify-center bg-pageBg">
			<div className="flex w-full max-w-80 flex-col gap-4 rounded-lg bg-white px-8 py-12">
				<BrandLogo className="" />
				<h2 className="pb-4 text-center text-xl font-semibold">Login to Continue</h2>

				<TextInput
					name="email"
					type="email"
					label="Email"
					placeholder="rashid@bizmate.com"
					required
					descriptionText="We will never share your email."
					errorText={errors.email}
				/>
				<TextInput placeholder="Shhh..." required name="password" type="password" label="Password" errorText={errors.password} />

				<Button className="mt-2" leftIcon={LockClosedIcon}>
					Login
				</Button>

				<p className="text-center text-sm text-gray-500">Login in with a different method</p>
				<LoginWithGoogle />
			</div>
		</div>
	)
}
