import { routeTree } from '@/routeTree.gen'
import { ArrowTopRightIcon, BarChartIcon, GearIcon, ListBulletIcon, PersonIcon, PieChartIcon, RocketIcon, TimerIcon } from '@radix-ui/react-icons'
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
			{ name: 'Designer', icon: RocketIcon, link: '/forms/designer', description: 'Design your forms' },
			{ name: 'All Forms', icon: ListBulletIcon, link: '/forms/', description: 'List all forms', search: { 'page': 1 } },
		],
	},
	{
		name: 'Automations',
		description: 'Automate your daily processes',
		routes: [
			{ name: 'Designer', icon: RocketIcon, description: 'Create a new automation', link: '/automations/designer' },
			{ name: 'All Automations', icon: ListBulletIcon, link: '/automations/', description: 'List all automations', search: { 'page': 1 } },
		],
	},
	{
		name: 'Dashboards',
		description: 'Create and manage your dashboards',
		routes: [
			{ name: 'Designer', icon: BarChartIcon, description: 'Create a new dashboard', link: '/dashboards/designer' },
			{ name: 'All Dashboards', icon: ListBulletIcon, description: 'List all dashboards', link: '/dashboards/', search: { 'page': 1 } },
		],
	},
	{
		name: 'Communications',
		description: 'Handle your communications from here',
		routes: [
			{ name: 'Contacts', icon: PersonIcon, link: '/communications/contacts', description: 'List all your contacts', search: { page: 1 } },
			{ name: 'Designer', icon: ArrowTopRightIcon, description: 'Create a new email template', link: '/communications/emails/designer' },
			{
				icon: ListBulletIcon,
				name: 'Email Templates',
				link: '/communications/emails/templates',
				description: 'List all email templates',
				search: { 'page': 1 },
			},
			{ name: 'Schedule Emails', icon: TimerIcon, link: '/communications/emails/schedules', description: 'Schedule emails to contacts' },
		],
	},
	{
		name: 'Projects',
		description: 'Create and manage your projects',
		routes: [{ name: 'All Projects', icon: ListBulletIcon, link: '/projects/', description: 'List all projects', search: { 'page': 1 } }],
	},
]

export const sideApp: App = {
	name: 'Account',
	description: 'Manage Account',
	routes: [
		{ name: 'Settings', description: 'Manage settings', icon: GearIcon, link: '/app/settings' },
		{ name: 'Changelog', description: 'Whats new on the platform', icon: PieChartIcon, link: '/app/chanelog' },
	],
}
