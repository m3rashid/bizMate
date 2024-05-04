import { createLazyFileRoute } from '@tanstack/react-router'
import PageContainer from '../components/pageContainer'

export const Route = createLazyFileRoute('/about')({
	component: About,
})

function About() {
	return (
		<PageContainer>
			<div className="p-2">Hello from About!</div>
		</PageContainer>
	)
}
