'use client';

import { queryKeys } from '@/api/queryKeys';
import { UnAuthorizedPage } from '@/components/lib/notFound';
import { Table, TableColumn } from '@/components/lib/table';
import { Tooltip } from '@/components/lib/tooltip';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_READ } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import { Activity } from '@/utils/types';
import dayjs from 'dayjs';

export function ActivityTab(props: { workspaceId: string }) {
	const { hasPermission } = usePermission();

	const colulmns: TableColumn<Activity>[] = [
		{
			dataKey: 'logLevel',
			title: 'Level',
			render: ({ row }) => (
				<Tooltip position='right' label={row.logLevel === 0 ? 'Info' : row.logLevel === 1 ? 'Warning' : 'Error'}>
					<div className={cn('m-2 h-4 w-4 rounded-full', row.logLevel === 0 ? 'bg-cyan-500' : row.logLevel === 1 ? 'bg-orange-500' : 'bg-red-500')} />
				</Tooltip>
			),
		},
		{
			dataKey: 'time',
			title: 'Time',
			render: ({ row }) => dayjs(row.time).format('DD MMM YYYY HH:mm A'),
		},
		{ dataKey: 'userEmail', title: 'User' },
		{ dataKey: 'objectType', title: 'Object Type' },
		{ dataKey: 'code', title: 'Code' },
		{
			dataKey: 'data',
			title: 'Data',
			render: ({ row }) =>
				row.data ? (
					<table className='border-spacing-x-8'>
						<tbody>
							{Object.entries(row.data).map(([key, value]) => (
								<tr key={key}>
									<td className='pr-1 font-semibold'>{key}</td>
									<td className='pl-1'>{value}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					'-'
				),
		},
	];

	if (!hasPermission('activity', PERMISSION_READ)) return <UnAuthorizedPage />;
	return (
		<Table<Activity>
			title='Workspace Activity'
			description='All the activities in the workspace'
			defaultEmptyStateName='activity'
			pageSize={15}
			columns={colulmns}
			paginateUrl={`/${props.workspaceId}/activity/all`}
			queryKeys={[queryKeys.workspaceActivity]}
			workspaceId={props.workspaceId}
		/>
	);
}
