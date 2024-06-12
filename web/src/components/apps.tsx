import { FC } from 'react'
import { Link, RouteIds } from '@tanstack/react-router'
import AtSymbolIcon from '@heroicons/react/24/outline/AtSymbolIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon'
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon'
import DeviceTabletIcon from '@heroicons/react/24/outline/DeviceTabletIcon'
import ClipboardDocumentIcon from '@heroicons/react/24/outline/ClipboardDocumentIcon'
import ChatBubbleLeftRightIcon from '@heroicons/react/24/outline/ChatBubbleLeftRightIcon'
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'
import PresentationChartLineIcon from '@heroicons/react/24/outline/PresentationChartLineIcon'

import { routeTree } from '../routeTree.gen'

export type Route = {
	name: string
	icon: FC<any>
	link: RouteIds<typeof routeTree>
	search?: Record<string, string | number>
}

export type App = {
	name: string
	icon: FC<any>
	description: string
	routes: Route[]
}

export const apps: Array<App> = [
	{
		name: 'Forms',
		icon: ClipboardDocumentIcon,
		description: 'Create, publish, and get analytics for your forms',
		routes: [
			{ name: 'Designer', icon: DeviceTabletIcon, link: '/apps/forms/designer' },
			{ name: 'All Forms', icon: ListBulletIcon, link: '/apps/forms/', search: { 'page': 1 } },
		],
	},
	{
		name: 'Automations',
		icon: ArrowPathIcon,
		description: 'Automate your daily processes',
		routes: [
			{ name: 'Designer', icon: AdjustmentsHorizontalIcon, link: '/apps/automations/designer' },
			{ name: 'All Automations', icon: ListBulletIcon, link: '/apps/automations/', search: { 'page': 1 } },
		],
	},
	{
		name: 'Dashboards',
		icon: PresentationChartLineIcon,
		description: 'Create and manage your dashboards',
		routes: [
			{ name: 'Designer', icon: ChartBarIcon, link: '/apps/dashboards/designer' },
			{ name: 'All Dashboards', icon: ListBulletIcon, link: '/apps/dashboards/', search: { 'page': 1 } },
		],
	},
	{
		name: 'Communications',
		icon: ChatBubbleLeftRightIcon,
		description: 'Handle your communications from here',
		routes: [
			{ name: 'Create Email Templates', icon: AtSymbolIcon, link: '/apps/communications/emails/designer' },
			{ name: 'Email Templates', icon: AtSymbolIcon, link: '/apps/communications/emails/templates', search: { 'page': 1 } },
			// { name: 'Schedule Emails', icon: AtSymbolIcon, link: '/apps/communications/emails/designer' },
		],
	},
	{
		name: 'Projects',
		icon: ClipboardDocumentIcon,
		description: 'Create and manage your projects',
		routes: [{ name: 'All Projects', icon: ListBulletIcon, link: '/apps/projects/', search: { 'page': 1 } }],
	},
]

function AppsList() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			<ResponsiveMasonry className="col-span-1 md:col-span-2 lg:col-span-3" columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}>
				<Masonry gutter="1rem" className="mb-4">
					{apps.map((app) => (
						<div key={app.name} className="select-none rounded-lg border-2 border-white p-4 shadow-lg hover:border-primary">
							<div className="mb-2 cursor-pointer hover:text-primary">
								<div className="flex gap-2">
									<app.icon className="h-8 w-8" />

									<div>
										<h3 className="text-xl font-semibold">{app.name}</h3>
										<p className="text-sm text-disabled">{app.description}</p>
									</div>
								</div>
							</div>

							<div className="ml-10 flex flex-col gap-2">
								{app.routes.map((route) => (
									<Link to={route.link} search={route.search} key={route.link} className="flex cursor-pointer items-center hover:text-primary">
										<route.icon className="h-4 w-4" />
										<h4 className="text-md ml-1 font-semibold">{route.name}</h4>
									</Link>
								))}
							</div>
						</div>
					))}
				</Masonry>
			</ResponsiveMasonry>

			<div className="">Other Links</div>
		</div>
	)
}

export default AppsList
