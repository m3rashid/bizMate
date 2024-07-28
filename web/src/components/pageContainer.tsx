import { getSession } from '@/actions/auth';
import { Header } from '@/components/home/header';
import { pages } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export type PageContainerProps = PropsWithChildren<{ workspaceId?: string; bodyClassName?: string }>;
export function PageContainer(props: PageContainerProps) {
	return (
		<>
			<Header workspaceId={props.workspaceId} />
			<div className={cn('h-[calc(100vh-48px)] overflow-y-auto p-2 sm:p-4', props.bodyClassName)}>{props.children}</div>
		</>
	);
}
