import { createLazyFileRoute } from '@tanstack/react-router'
import PageContainer from '../components/pageContainer'
import { useAuth } from '../hooks/auth'

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
