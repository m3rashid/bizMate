import { routeTree } from '../routeTree.gen'
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'
import AtSymbolIcon from '@heroicons/react/24/outline/AtSymbolIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'
import DeviceTabletIcon from '@heroicons/react/24/outline/DeviceTabletIcon'
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import { RouteIds } from '@tanstack/react-router'
import { FC } from 'react'

export type Route = {
	name: string
	icon: FC<any>
	link: RouteIds<typeof routeTree>
	description: string
	search?: Record<string, string | number>
}

export type App = {
	name: string
	description: string
	routes: Route[]
}

export const apps: App[] = [
	{
		name: 'Forms',
		description: 'Create, publish, and get analytics for your forms',
		routes: [
			{ name: 'Designer', icon: DeviceTabletIcon, link: '/forms/designer', description: 'Design your forms' },
			{ name: 'All Forms', icon: ListBulletIcon, link: '/forms/', description: 'List all forms', search: { 'page': 1 } },
		],
	},
	{
		name: 'Dashboards',
		description: 'Create and manage your dashboards',
		routes: [
			{ name: 'All Dashboards', icon: ListBulletIcon, description: 'List all dashboards', link: '/dashboards/', search: { 'page': 1 } },
			//
		],
	},
	{
		name: 'Automations',
		description: 'Automate your daily processes',
		routes: [
			{ name: 'Designer', icon: AdjustmentsHorizontalIcon, description: 'Create a new automation', link: '/automations/designer' },
			{ name: 'All Automations', icon: ListBulletIcon, link: '/automations/', description: 'List all automations', search: { 'page': 1 } },
		],
	},
	{
		name: 'Communications',
		description: 'Handle your communications from here',
		routes: [
			{ name: 'Contacts', icon: UsersIcon, link: '/communications/contacts/', description: 'List all your contacts', search: { page: 1 } },
			{ name: 'Designer', icon: AtSymbolIcon, description: 'Create a new email template', link: '/communications/emails/designer' },
			{
				icon: AtSymbolIcon,
				name: 'Email Templates',
				link: '/communications/emails/templates',
				description: 'List all email templates',
				search: { 'page': 1 },
			},
			// { name: 'Schedule Emails', icon: AtSymbolIcon, link: '/communications/emails/designer' },
		],
	},
	{
		name: 'Projects',
		description: 'Create and manage your projects',
		routes: [
			{ name: 'All Projects', icon: ListBulletIcon, link: '/projects/', description: 'List all projects', search: { 'page': 1 } },
			//
		],
	},
]

export const sideApp: App = {
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
}

export const flattenedRoutes = [...apps, sideApp].reduce<Array<Route>>((acc, app) => [...acc, ...app.routes], [])
