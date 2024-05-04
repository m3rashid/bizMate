import { useEffect, useRef, useState } from 'react'
import { Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'

import { useAuth } from '../../hooks/auth'
import BrandLogo from '../../components/lib/brandLogo'
import LoginWithGoogle from '../../components/auth/loginWithGoogle'
import LoginWithCredentials, { LoginWithCredentialsProps } from '../../components/auth/credentials'

export const Route = createFileRoute('/auth/login')({ component: Login })

function Login() {
	const navigate = useNavigate()
	const transitionStartedRef = useRef(false)
	const { auth: user, checkAuth } = useAuth()
	const [type, setType] = useState<LoginWithCredentialsProps['type']>('register')

	async function onSuccess() {
		await checkAuth()
		transitionStartedRef.current = true
	}

	useEffect(() => {
		if (transitionStartedRef?.current) navigate({ to: '/' })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (user.isAuthenticated) {
		return <Navigate to="/" /> // handle redirects and protected routes
	}

	return (
		<div className="flex h-screen items-center justify-center bg-pageBg">
			<div className="flex w-full max-w-80 flex-col gap-4 rounded-lg bg-white px-6 py-12">
				<BrandLogo className="" />
				<h2 className="pb-4 text-center text-xl font-semibold">{type === 'login' ? 'Login to Continue' : 'Register to get Started'}</h2>

				<LoginWithCredentials type={type} />
				<p
					onClick={() => setType((prev) => (prev === 'login' ? 'register' : 'login'))}
					className="mb-1 cursor-pointer text-center text-sm text-primary hover:text-danger"
				>
					{type === 'login' ? "Don't have an account? Register Instead" : 'Already have an account? Login Instead'}
				</p>

				<div className="flex w-full flex-col">
					<p className="mb-1 text-center text-sm text-gray-500">Login in with a different method</p>
					<LoginWithGoogle onSuccess={onSuccess} />
				</div>
			</div>
		</div>
	)
}
