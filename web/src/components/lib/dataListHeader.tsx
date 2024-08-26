'use client';

import { Button, ButtonProps } from '@/components/lib/button';
import { TableExport, TableExportProps } from '@/components/lib/tableExport';
import { cn } from '@/utils/helpers';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useTransitionRouter } from 'next-view-transitions';
import { ReactNode } from 'react';

type DataListHeaderProps = {
	title?: string;
	isFetching: boolean;
	refetch?: () => void;
	workspaceId: string;
	description?: string;
	hideRefresh?: boolean;
	addButtonLink?: string;
	otherActions?: ReactNode;
	addButtonProps?: ButtonProps;
	defaultEmptyStateName?: string;
	tableExportprops?: TableExportProps;
};

export function DataListHeader(props: DataListHeaderProps) {
	const router = useTransitionRouter();

	return (
		<div className={cn('sm:flex sm:items-center', props.title || props.description || props.addButtonLink ? 'mb-8' : '')}>
			{props.title || props.description ? (
				<div className='sm:flex-auto'>
					{props.title ? <h1 className='text-2xl font-semibold leading-6 text-gray-900'>{props.title}</h1> : null}
					{props.description ? <p className='mt-2 text-sm text-gray-700'>{props.description}</p> : null}
				</div>
			) : null}

			<div className='mt-4 flex flex-wrap items-center justify-center gap-2 sm:ml-8 sm:mt-0'>
				{!props.hideRefresh ? (
					<Button
						size='small'
						variant='simple'
						onClick={() => props.refetch?.()}
						LeftIcon={<ArrowPathIcon className={cn('h-[18px] w-[18px]', props.isFetching ? 'animate-spin' : '')} />}
					/>
				) : null}
				{props.otherActions}
				{props.addButtonLink || Object.keys(props.addButtonProps || {}).length > 0 ? (
					<Button
						size='small'
						LeftIcon={<PlusIcon className='h-5 w-5' />}
						onClick={() => router.push(props.addButtonLink || '/not-found')}
						label={`Create ${props.title || props.defaultEmptyStateName}`}
						{...props.addButtonProps}
					/>
				) : null}
				{/* {props.tableExportprops ? <TableExport {...props.tableExportprops} /> : null} */}
			</div>
		</div>
	);
}
