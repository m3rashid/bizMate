import apiClient from '@api/client'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/choose-workspace')({
	component: ChooseWorkspace,
	// beforeLoad: ({ context }) => {
	// 	if (context.auth.workspaceId != '') {
	// 	}
	// },
})

function ChooseWorkspace() {
	const {} = useQuery({
		queryKey: ['getUserWorkspaces'],
		queryFn: () => apiClient('/workspaces'),
	})

	return <div>Hello /auth/choose-workspace!</div>
}
