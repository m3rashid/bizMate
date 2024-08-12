import { PropsWithChildren } from 'react';

export default function RootLayout(props: PropsWithChildren) {
	return <div className='h-screen'>{props.children}</div>;
}
