import apiClient from '@api/client'
import WorkspaceCard, { CreateWorkspace } from '@components/auth/workspace'
import { PageLoader } from '@components/lib/loader'
import PageContainer from '@components/pageContainer'
import { useAuthState } from '@hooks/auth'
import { Workspace } from '@mytypes'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/choose-workspace')({
	component: ChooseWorkspace,
	beforeLoad: ({ context }) => {
		if (!context.auth.isAuthenticated) throw redirect({ to: '/auth/login' })
	},
})

function ChooseWorkspace() {
	const { data, isPending, refetch } = useQuery<Workspace[]>({
		queryKey: ['getUserWorkspaces'],
		queryFn: () => apiClient('/auth/workspaces'),
	})

	const { setAuth } = useAuthState()
	const navigate = useNavigate({ from: '/auth/choose-workspace' })

	function handleChooseWorkspace(workspaceId: Workspace['id']) {
		setAuth((prev) => ({ ...prev, workspaceId }))
		navigate({ to: '/$workspaceId', params: { workspaceId }, replace: true })
	}

	if (isPending) return <PageLoader />
	return (
		<PageContainer workspaceId="">
			<div className="flex flex-wrap items-center gap-4">
				{data?.map((workspace) => <WorkspaceCard key={workspace.id} {...workspace} onClick={() => handleChooseWorkspace(workspace.id)} />)}
				<CreateWorkspace onSuccess={refetch} />
			</div>
		</PageContainer>
	)
}
