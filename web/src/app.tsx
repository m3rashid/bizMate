import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import { useAuth } from './hooks/auth'
import { useEffect } from 'react'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

function App() {
	const { checkAuth } = useAuth()

	useEffect(() => {
		checkAuth().catch(console.log)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <RouterProvider router={router} />
}

export default App
