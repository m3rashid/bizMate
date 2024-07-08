import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon'
import AtSymbolIcon from '@heroicons/react/24/outline/AtSymbolIcon'
import CogIcon from '@heroicons/react/24/outline/CogIcon'
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import { PageRoute } from '@mytypes'
import { FC } from 'react'

export type Route = {
	name: string
	icon: FC<any>
	link: PageRoute
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
			// Designer to be specific to a single form, not generic
			// { name: 'Designer', icon: DeviceTabletIcon, link: '/$workspaceId/forms/designer', description: 'Design your forms' },
			{ name: 'Forms', icon: ListBulletIcon, link: '/$workspaceId/forms/', description: 'List all forms', search: { 'page': 1 } },
		],
	},
	{
		name: 'Dashboards',
		description: 'Create and manage your dashboards',
		routes: [
			{ name: 'Dashboards', icon: ListBulletIcon, description: 'List all dashboards', link: '/$workspaceId/dashboards/', search: { 'page': 1 } },
			//
		],
	},
	{
		name: 'Automations',
		description: 'Automate your daily processes',
		routes: [
			{ name: 'Designer', icon: AdjustmentsHorizontalIcon, description: 'Create a new automation', link: '/$workspaceId/automations/designer' },
			{
				name: 'Automations',
				icon: ListBulletIcon,
				link: '/$workspaceId/automations/',
				description: 'List all automations',
				search: { 'page': 1 },
			},
		],
	},
	{
		name: 'Communications',
		description: 'Handle your communications from here',
		routes: [
			{
				name: 'Contacts',
				icon: UsersIcon,
				link: '/$workspaceId/communications/contacts/',
				description: 'List all your contacts',
				search: { page: 1 },
			},
			{ name: 'Designer', icon: AtSymbolIcon, description: 'Create a new email template', link: '/$workspaceId/communications/emails/designer' },
			{
				icon: AtSymbolIcon,
				name: 'Email Templates',
				link: '/$workspaceId/communications/emails/templates',
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
			{ name: 'Projects', icon: ListBulletIcon, link: '/$workspaceId/projects/', description: 'List all projects', search: { 'page': 1 } },
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
