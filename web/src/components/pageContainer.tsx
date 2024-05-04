import { PropsWithChildren } from 'react'

import Header, { HeaderProps } from './header'

export type PageContainerProps = PropsWithChildren & {
	headerProps?: HeaderProps
}

function PageContainer(props: PageContainerProps) {
	return (
		<>
			<Header {...props.headerProps} />
			{props.children}
		</>
	)
}

export default PageContainer
