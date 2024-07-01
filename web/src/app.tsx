import { router } from './router'
import { PageLoader } from '@components/lib/loader'
import { ActionPopupContainer, MessagePopupContainer } from '@components/lib/popups'
import { AuthState, authAtom, checkAuth, useAuthState } from '@hooks/auth'
import { RouterProvider } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'

function AppChildren() {
	const { auth } = useAuthState()

	useEffect(() => {
		if (!auth.isAuthenticated && window.location.pathname !== '/auth/login') window.location.href = '/auth/login'
	}, [auth.isAuthenticated])

	return (
		<>
			<RouterProvider router={router} context={{ auth }} />
			<MessagePopupContainer />
			<ActionPopupContainer />
		</>
	)
}

function App() {
	const [initRes, setInitRes] = useState<AuthState | null>(null)

	const checkAuthInit = useCallback(async () => {
		let retries = 0
		const maxRetries = 1

		while (retries < maxRetries) {
			try {
				const user = await checkAuth()
				setInitRes({ isAuthenticated: true, user, workspaceId: '' })
				break
			} catch (err: any) {
				retries++
				if (retries >= maxRetries) {
					setInitRes({ isAuthenticated: false, user: null, workspaceId: '' })
					break
				} else {
					const delay = Math.pow(2, retries) * 1000
					await new Promise((resolve) => setTimeout(resolve, delay))
				}
			}
		}
	}, [])

	useEffect(() => {
		checkAuthInit()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!initRes) return <PageLoader />
	return (
		<RecoilRoot initializeState={({ set }) => set(authAtom, initRes)}>
			<AppChildren />
		</RecoilRoot>
	)
}

export default App
