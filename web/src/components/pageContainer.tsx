import { Header } from '@/components/home/header';
import { cn } from '@/utils/helpers';
import { PropsWithChildren } from 'react';

export type PageContainerProps = PropsWithChildren<{ workspaceId?: string; bodyClassName?: string }>;
export function PageContainer(props: PageContainerProps) {
	return (
		<>
			<Header workspaceId={props.workspaceId} />
			<main className={cn('h-[calc(100vh-48px)] overflow-y-auto bg-white p-2 sm:p-4', props.bodyClassName)}>{props.children}</main>
		</>
	);
}
