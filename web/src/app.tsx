import { PageLoader } from './components/lib/loader'
import { ActionPopupContainer, MessagePopupContainer } from './components/lib/popups'
import { AuthState, authAtom, checkAuth, useAuthState } from './hooks/auth'
import { router } from './router'
import { RouterProvider } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'

function AppChildren() {
	const { auth } = useAuthState()
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
				setInitRes({ isAuthenticated: true, user })
				break
			} catch (err: any) {
				retries++
				if (retries >= maxRetries) {
					setInitRes({ isAuthenticated: false, user: null })
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
