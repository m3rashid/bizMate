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
			{ name: 'Forms', icon: ListBulletIcon, link: '/$workspaceId/forms/', description: 'List all forms', search: { 'page': 1 } },
			//
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
