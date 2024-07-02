import Button from '@components/lib/button'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: HomeRoute,
	beforeLoad: ({ context }) => {
		if (context.auth.isAuthenticated) throw redirect({ to: '/auth/choose-workspace' })
	},
})

function HomeRoute() {
	const navigate = useNavigate({ from: '/' })

	return (
		<div className="p-4">
			<Button onClick={() => navigate({ to: '/auth/login' })}>Login</Button>
		</div>
	)
}
