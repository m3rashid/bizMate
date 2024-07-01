import LoginRoot from '@components/auth/loginRoot'
import { useAuthState } from '@hooks/auth'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/login')({
	component: Login,
	beforeLoad: ({ context }) => {
		if (context.auth.isAuthenticated) throw redirect({ to: '/' })
	},
})

function Login() {
	const navigate = useNavigate()
	const { auth } = useAuthState()

	useEffect(() => {
		if (auth.isAuthenticated) navigate({ to: '/', replace: true })
	}, [auth.isAuthenticated])

	return <LoginRoot />
}
