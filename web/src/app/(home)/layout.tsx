import { PageContainer } from '@/components/pageContainer';
import { PropsWithChildren } from 'react';

export default function RootLayout(props: PropsWithChildren) {
	return <PageContainer>{props.children}</PageContainer>;
}
