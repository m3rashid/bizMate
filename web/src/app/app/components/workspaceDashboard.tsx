"use client"

import { useGetWorkspaceDashboardData } from "@/api/dashboard/client"
import { PropsWithChildren } from "react"

function DataCard(props: PropsWithChildren<{title: string, description: string}>) {
	return (
		<div className='relative h-min select-none rounded-lg px-6 py-4 shadow-lg ring-2 ring-gray-100 hover:ring-primary w-full sm:w-max sm:min-w-72'>
			<h3 className='text-md font-semibold mb-4'>{props.title}</h3>
			{props.children}
			<p className='text-sm text-disabled mt-4'>{props.description}</p>
		</div>
	)
}

export function WorkspaceDashboard(props: { workspaceId: string }) {
	const {data, isPending} = useGetWorkspaceDashboardData(props.workspaceId)
	
	if (isPending || !data?.data) return null
	return (
		<div className="mx-auto max-w-7xl px-6 lg:px-8 py-2 mt-4 mb-8">
			<div className="flex gap-4 flex-wrap">
				<DataCard title="Forms" description="View your active/inactive forms">
					<div className="flex items-center gap-2 justify-between">
						<div className="flex gap-2 items-baseline">
							<div className="text-4xl font-semibold text-success">{data.data.form.active}</div>
							<div className="text-disabled">Active</div>
						</div>

						<div className="flex gap-2 items-baseline">
							<div className="text-4xl font-semibold text-danger">{data.data.form.inactive}</div>
							<div className="text-disabled">Inactive</div>
						</div>
					</div>
				</DataCard>

				<DataCard title="People" description="Number of people in the workspace">
					<div className="text-4xl font-semibold text-center">{data.data.users}</div>
				</DataCard>
			</div>
		</div>
	)
}
