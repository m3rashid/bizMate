import { PageLoader } from './components/lib/loader'
import { ActionPopupContainer, MessagePopupContainer } from './components/lib/popups'
import { AuthState, authAtom, checkAuth } from './hooks/auth'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

function App() {
	const [initRes, setInitRes] = useState<AuthState | null>(null)

	const checkAuthInit = useCallback(async () => {
		try {
			const user = await checkAuth()
			setInitRes({ isAuthenticated: true, user })
		} catch (err: any) {
			setInitRes({ isAuthenticated: false, user: null })
		}
	}, [])

	useEffect(() => {
		checkAuthInit()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!initRes) return <PageLoader />
	return (
		<RecoilRoot initializeState={({ set }) => set(authAtom, initRes)}>
			<RouterProvider router={router} />
			<MessagePopupContainer />
			<ActionPopupContainer />
		</RecoilRoot>
	)
}

export default App
