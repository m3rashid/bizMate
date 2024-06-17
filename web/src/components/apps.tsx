import { FC } from 'react'
import { Link, RouteIds } from '@tanstack/react-router'
import CogIcon from '@heroicons/react/24/outline/CogIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import AtSymbolIcon from '@heroicons/react/24/outline/AtSymbolIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon'
import DeviceTabletIcon from '@heroicons/react/24/outline/DeviceTabletIcon'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'

import Tooltip from './lib/tooltip'
import { routeTree } from '../routeTree.gen'

type Route = {
	name: string
	icon: FC<any>
	link: RouteIds<typeof routeTree>
	description: string
	search?: Record<string, string | number>
}

type App = {
	name: string
	description: string
	routes: Route[]
}

const apps: App[] = [
	{
		name: 'Forms',
		description: 'Create, publish, and get analytics for your forms',
		routes: [
			{ name: 'Designer', icon: DeviceTabletIcon, link: '/apps/forms/designer', description: 'Design your forms' },
			{ name: 'All Forms', icon: ListBulletIcon, link: '/apps/forms/', description: 'List all forms', search: { 'page': 1 } },
		],
	},
	{
		name: 'Automations',
		description: 'Automate your daily processes',
		routes: [
			{ name: 'Designer', icon: AdjustmentsHorizontalIcon, description: 'Create a new automation', link: '/apps/automations/designer' },
			{ name: 'All Automations', icon: ListBulletIcon, link: '/apps/automations/', description: 'List all automations', search: { 'page': 1 } },
		],
	},
	{
		name: 'Dashboards',
		description: 'Create and manage your dashboards',
		routes: [
			{ name: 'Designer', icon: ChartBarIcon, description: 'Create a new dashboard', link: '/apps/dashboards/designer' },
			{ name: 'All Dashboards', icon: ListBulletIcon, description: 'List all dashboards', link: '/apps/dashboards/', search: { 'page': 1 } },
		],
	},
	{
		name: 'Communications',
		description: 'Handle your communications from here',
		routes: [
			{ name: 'Contacts', icon: UsersIcon, link: '/apps/communications/contacts/', description: 'List all your contacts', search: { page: 1 } },
			{ name: 'Designer', icon: AtSymbolIcon, description: 'Create a new email template', link: '/apps/communications/emails/designer' },
			{
				icon: AtSymbolIcon,
				name: 'Email Templates',
				link: '/apps/communications/emails/templates',
				description: 'List all email templates',
				search: { 'page': 1 },
			},
			// { name: 'Schedule Emails', icon: AtSymbolIcon, link: '/apps/communications/emails/designer' },
		],
	},
	{
		name: 'Projects',
		description: 'Create and manage your projects',
		routes: [{ name: 'All Projects', icon: ListBulletIcon, link: '/apps/projects/', description: 'List all projects', search: { 'page': 1 } }],
	},
]

const sideApps: App[] = [
	{
		name: 'Account',
		description: 'Manage Account',
		routes: [
			{
				name: 'Settings',
				description: 'Manage settings',
				icon: CogIcon,
				link: '/about',
			},
		],
	},
	{
		name: 'Platform',
		description: 'About the platform',
		routes: [
			{
				name: 'About',
				description: 'About the platform',
				icon: CogIcon,
				link: '/about',
			},
			{
				name: 'Changelogs',
				description: "What's new on the platform",
				icon: CogIcon,
				link: '/changelogs',
			},
		],
	},
]

function RenderApp(app: App) {
	return (
		<div className="h-min select-none rounded-lg border-2 border-white p-2 shadow-lg hover:border-primary">
			<div className="flex items-center gap-2">
				<h3 className="font-semibold text-disabled">{app.name}</h3>
				<Tooltip label={app.description} show="right">
					<InformationCircleIcon className="h-5 w-5 text-disabled" />
				</Tooltip>
			</div>

			<div className="mt-3 flex flex-col gap-4">
				{app.routes.map((route) => (
					<Link
						to={route.link}
						key={route.link}
						search={route.search}
						className="group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-primaryLight hover:shadow-md"
					>
						<route.icon className="h-10 w-10 rounded-md bg-skeletonLight p-2 shadow-md group-hover:bg-white" />

						<div className="text-sm">
							<h4 className="-mb-1 mt-1 py-0 font-semibold">{route.name}</h4>
							<div className="-mt-1 text-disabled">{route.description}</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}

function AppsList() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			<ResponsiveMasonry className="col-span-1 md:col-span-2 lg:col-span-3" columnsCountBreakPoints={{ 300: 1, 1100: 2, 1600: 3 }}>
				<Masonry gutter="1rem" className="mb-4">
					{apps.map((app) => (
						<RenderApp key={app.name} {...app} />
					))}
				</Masonry>
			</ResponsiveMasonry>

			<div className="flex flex-col gap-4">
				{sideApps.map((app) => (
					<RenderApp key={app.name} {...app} />
				))}
			</div>
		</div>
	)
}

export default AppsList
