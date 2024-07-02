import Header from '@components/header'
import { useAuthState } from '@hooks/auth'
import { useNavigate } from '@tanstack/react-router'
import { PropsWithChildren, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export type PageContainerProps = PropsWithChildren & {
	workspaceId: string
	bodyClassName?: string
}

function PageContainer(props: PageContainerProps) {
	const { auth } = useAuthState()
	const navigate = useNavigate()

	useEffect(() => {
		if (!auth.isAuthenticated) navigate({ to: '/auth/login', search: { redirect: window.location.href } })
	}, [])

	return (
		<>
			<Header workspaceId={props.workspaceId} />
			<div className={twMerge('h-[calc(100vh-48px)] overflow-y-auto p-2 sm:p-4', props.bodyClassName)}>{props.children}</div>
		</>
	)
}

export default PageContainer
