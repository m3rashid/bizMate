import { PageContainer } from '@/components/pageContainer';
import { PropsWithChildren } from 'react';

export default async function RootLayout(props: PropsWithChildren) {
	return <div className='h-screen'>{props.children}</div>;
}
