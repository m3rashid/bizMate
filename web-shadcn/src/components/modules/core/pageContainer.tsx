import { Sidebar } from './sidebar'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export function PageContainer(props: PropsWithChildren<{ className?: string }>) {
	return (
		<Sidebar defaultCollapsed={document.body.clientWidth < 400}>
			<div className={twMerge('max-h-screen min-h-screen overflow-y-auto bg-gray-100 p-4', props.className)}>{props.children}</div>
		</Sidebar>
	)
}
