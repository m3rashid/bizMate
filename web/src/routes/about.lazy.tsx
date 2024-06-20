import { createLazyFileRoute } from '@tanstack/react-router'

import PageContainer from '../components/pageContainer'
import Upload from '../components/upload'

export const Route = createLazyFileRoute('/about')({
	component: About,
})

function About() {
	return (
		<PageContainer>
			<Upload onFinalize={console.log} />
			<div className="">Hello from About!</div>
		</PageContainer>
	)
}
