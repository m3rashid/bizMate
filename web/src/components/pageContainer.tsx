import { PropsWithChildren } from 'react'

import Header, { HeaderProps } from './header'
import { twMerge } from 'tailwind-merge'

export type PageContainerProps = PropsWithChildren & {
	headerProps?: HeaderProps
	bodyClassName?: string
}

function PageContainer(props: PageContainerProps) {
	return (
		<>
			<Header {...props.headerProps} />
			<div className={twMerge('p-4', props.bodyClassName)}>{props.children}</div>
		</>
	)
}

export default PageContainer
