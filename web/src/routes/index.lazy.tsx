import { createLazyFileRoute } from '@tanstack/react-router'

import { useAuth } from '../hooks/auth'
import PageContainer from '../components/pageContainer'

export const Route = createLazyFileRoute('/')({ component: Index })

function Index() {
	const { auth: user } = useAuth()

	return (
		<PageContainer>
			<div className="p-2">
				<h3>Welcome Home!</h3>

				<pre>{JSON.stringify(user, null, 2)}</pre>
			</div>
		</PageContainer>
	)
}
