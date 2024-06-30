import { AuthState } from '../hooks/auth'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy } from 'react'

const TanStackRouterDevtools =
	import.meta.env.MODE === 'production'
		? () => null
		: lazy(() => import('@tanstack/router-devtools').then((res) => ({ default: res.TanStackRouterDevtools })))

export const Route = createRootRouteWithContext<{ auth: AuthState }>()({
	component: () => (
		<>
			<Outlet />

			<TanStackRouterDevtools />
		</>
	),
})
