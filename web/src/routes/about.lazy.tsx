import { createLazyFileRoute } from '@tanstack/react-router'

import PageContainer from '../components/pageContainer'

export const Route = createLazyFileRoute('/about')({
	component: About,
})

function About() {
	return <PageContainer>Hello from About!</PageContainer>
}
