import LoginWithCredentials, { LoginWithCredentialsProps } from '../../components/auth/credentials'
import LoginWithGoogle from '../../components/auth/loginWithGoogle'
import BrandLogo from '../../components/lib/brandLogo'
import { useAuth } from '../../hooks/auth'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/auth/login')({ component: Login })

function Login() {
	const navigate = useNavigate()
	const { auth } = useAuth()
	const [type, setType] = useState<LoginWithCredentialsProps['type']>('register')
	const nextLocation = useRouterState({
		select: (s) => {
			const state = s.location.state
			if (!state || !(state as any).prevLocation) return '/'
			const loc: Location = JSON.parse((state as any).prevLocation)
			return loc.pathname + loc.search + loc.hash
		},
	})

	useEffect(() => {
		if (auth.isAuthenticated) navigate({ to: nextLocation })
	}, [auth.isAuthenticated])

	return (
		<div className="flex h-screen items-center justify-center bg-pageBg">
			<div className="relative flex w-full max-w-96 flex-col gap-4 rounded-lg bg-white px-6 pb-12 pt-[90px]">
				<BrandLogo className="absolute -top-6 left-6" />
				<h2 className="absolute left-[132px] top-6 text-xl font-semibold">{type === 'login' ? 'Login to Continue' : 'Register to get Started'}</h2>

				<LoginWithCredentials type={type} />
				<p
					onClick={() => setType((prev) => (prev === 'login' ? 'register' : 'login'))}
					className="mb-1 cursor-pointer text-center text-sm text-primary hover:text-danger"
				>
					{type === 'login' ? "Don't have an account? Register Instead" : 'Already have an account? Login Instead'}
				</p>

				<div className="flex w-full flex-col">
					<p className="mb-1 text-center text-sm text-gray-500">Login in with a different method</p>
					<LoginWithGoogle />
				</div>
			</div>
		</div>
	)
}
