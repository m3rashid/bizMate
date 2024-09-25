"use client"

import { App, apps, sideApp } from "@/components/home/appsList";
import { usePermission } from "@/hooks/permission";
import { PERMISSION_READ, workspaceKey } from "@/utils/constants";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export function SingleApp(props: {app: App,workspaceId: string}) {
	const { hasPermission } = usePermission();

	return (
		<div className="flex items-center justify-center flex-col p-4 py-6 shadow-lg rounded-lg hover:ring-primary ring-2 ring-gray-100 select-none">
			<h3 className="mt-2 text-lg font-semibold">{props.app.name}</h3>
			<p className="mt-1 text-sm text-center text-disabled">{props.app.description}</p>

			<div className="w-full mt-6">
				{props.app.routes.map((route) => {
					if (!route.objectType || (route.objectType && hasPermission(route.objectType, PERMISSION_READ))) {
						return (
							<Link
								key={route.link}
								href={route.link.replace(workspaceKey, props.workspaceId)}
								className='group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-primaryLight hover:shadow-md mt-2'
							>
								<route.icon className='h-8 w-8 rounded-md bg-skeletonLight p-1.5 shadow-md group-hover:bg-white' />
								<div className='flex flex-col gap-1.5'>
									<h4 className='-mb-1 mt-1 py-0 text-sm font-semibold'>{route.name}</h4>
									<div className='-mt-1 text-xs text-disabled group-hover:text-gray-500'>{route.description}</div>
								</div>
							</Link>
						);
					}
				})}
			</div>
		</div>
	)
}

export function ProjectsGrid(props: { workspaceId: string }) {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:px-8 py-2">
			<h2 className="mb-4 text-lg font-semibold ml-0.5">Apps and Services</h2>

			<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
				<Masonry gutter="1rem">
					{[...apps, sideApp].map((app) => (
						<SingleApp key={app.name} app={app} workspaceId={props.workspaceId} />
					))}
				</Masonry>
			</ResponsiveMasonry>
		</div>
	)
}
