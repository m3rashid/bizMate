'use client';

import { useGetWorkspaceDashboardData } from '@/api/dashboard/client';
import { PropsWithChildren } from 'react';

function DataCard(props: PropsWithChildren<{ title: string; description: string }>) {
	return (
		<div className='relative h-min w-full select-none rounded-lg px-6 py-4 shadow-lg ring-2 ring-gray-100 hover:ring-primary sm:w-max sm:min-w-72'>
			<h3 className='text-md mb-4 font-semibold'>{props.title}</h3>
			{props.children}
			<p className='mt-4 text-sm text-disabled'>{props.description}</p>
		</div>
	);
}

export function WorkspaceDashboard(props: { workspaceId: string }) {
	const { data, isPending } = useGetWorkspaceDashboardData(props.workspaceId);

	if (isPending || !data?.data) return null;
	return (
		<div className='mx-auto mb-8 mt-4 max-w-7xl px-6 py-2 lg:px-8'>
			<div className='flex flex-wrap gap-4'>
				<DataCard title='Forms' description='View your active/inactive forms'>
					<div className='flex items-center justify-between gap-2'>
						<div className='flex items-baseline gap-2'>
							<div className='text-4xl font-semibold text-success'>{data.data.form.active}</div>
							<div className='text-disabled'>Active</div>
						</div>

						<div className='flex items-baseline gap-2'>
							<div className='text-4xl font-semibold text-danger'>{data.data.form.inactive}</div>
							<div className='text-disabled'>Inactive</div>
						</div>
					</div>
				</DataCard>

				<DataCard title='People' description='Number of people in the workspace'>
					<div className='text-center text-4xl font-semibold'>{data.data.users}</div>
				</DataCard>
			</div>
		</div>
	);
}
