import PageContainer from '@components/pageContainer'
import Upload from '@components/upload'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
	component: About,
})

function About() {
	return (
		<PageContainer workspaceId="">
			<Upload onFinalize={console.log} />
			<div className="">Hello from About!</div>
		</PageContainer>
	)
}
