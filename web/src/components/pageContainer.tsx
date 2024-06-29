import Header, { HeaderProps } from './header'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export type PageContainerProps = PropsWithChildren & {
	headerProps?: HeaderProps
	bodyClassName?: string
}

function PageContainer(props: PageContainerProps) {
	return (
		<>
			<Header {...props.headerProps} />
			<div className={twMerge('h-[calc(100vh-48px)] overflow-y-auto p-2 sm:p-4', props.bodyClassName)}>{props.children}</div>
		</>
	)
}

export default PageContainer
