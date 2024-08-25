'use client';

import { App } from '@/components/home/appsList';
import { Tooltip } from '@/components/lib/tooltip';
import { usePermission } from '@/hooks/permission';
import { PERMISSION_READ, workspaceKey } from '@/utils/constants';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { Link } from 'next-view-transitions';

export function RenderApp(props: { app: App; workspaceId: string }) {
	const { hasPermission } = usePermission();

	const overallPermitted = props.app.routes.some(
		(route) => !route.objectType || (route.objectType && hasPermission(route.objectType, PERMISSION_READ))
	);

	if (!overallPermitted) return null;
	return (
		<div className='h-min select-none'>
			<div className='flex items-center gap-2'>
				<h3 className='text-sm font-semibold text-disabled'>{props.app.name}</h3>
				<Tooltip label={props.app.description} position='right'>
					<InformationCircleIcon className='h-4 w-4 text-disabled' />
				</Tooltip>
			</div>

			<div className='mt-1.5 flex flex-col gap-2'>
				{props.app.routes.map((route) => {
					if (!route.objectType || (route.objectType && hasPermission(route.objectType, PERMISSION_READ)))
						return (
							<Link
								key={route.link}
								href={route.link.replace(workspaceKey, props.workspaceId)}
								className='group flex cursor-pointer items-center gap-2 rounded-md px-2 py-0.5 hover:bg-primaryLight hover:shadow-md'
							>
								<route.icon className='h-9 w-9 rounded-md bg-skeletonLight p-2 shadow-md group-hover:bg-white' />

								<div className='flex flex-col gap-1.5'>
									<h4 className='-mb-1 mt-1 py-0 text-sm font-semibold'>{route.name}</h4>
									<div className='-mt-1 text-xs text-disabled'>{route.description}</div>
								</div>
							</Link>
						);
				})}
			</div>
		</div>
	);
}
