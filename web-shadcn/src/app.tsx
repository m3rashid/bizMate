import { routeTree } from './routeTree.gen'
// import { authAtom, checkAuth, AuthState } from '@/hooks/auth'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import {
	Suspense, //  useCallback, useEffect, useState
} from 'react'
import { RecoilRoot } from 'recoil'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

function App() {
	// const [initRes, setInitRes] = useState<AuthState | null>(null)

	// const initApp = useCallback(async () => {
	// 	let retryCount = 0
	// 	const maxRetries = 4

	// 	while (retryCount < maxRetries) {
	// 		try {
	// 			const res = await checkAuth()
	// 			if (!res) setInitRes({ isAuthenticated: false, user: null })
	// 			else setInitRes({ isAuthenticated: true, user: res })
	// 			return
	// 		} catch (err) {
	// 			retryCount++
	// 			if (retryCount >= maxRetries) {
	// 				console.log("Couldn't initialize app")
	// 			} else {
	// 				await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
	// 			}
	// 		}
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [])

	// useEffect(() => {
	// 	initApp()
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [])

	// if (!initRes) return <div>Loading ...</div>
	return (
		<Suspense fallback={<div>Loading ...</div>}>
			<RecoilRoot
			// initializeState={({ set }) => set(authAtom, initRes)}
			>
				<RouterProvider router={router} />
			</RecoilRoot>
		</Suspense>
	)
}

export default App
