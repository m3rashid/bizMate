import { workspaceKey } from '@/utils/constants';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import { FC } from 'react';

export type Route = {
	name: string;
	icon: FC<any>;
	link: string;
	description: string;
};

export type App = {
	name: string;
	description: string;
	routes: Route[];
};

export const apps: App[] = [
	{
		name: 'Forms',
		description: 'Create, publish, and get analytics for your forms',
		routes: [
			{ name: 'Forms', icon: ListBulletIcon, link: `/${workspaceKey}/forms?page=1`, description: 'List all forms' },
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
				link: `/${workspaceKey}/communications/contacts?page=1`,
				description: 'List all your contacts',
			},
		],
	},
	{
		name: 'Projects',
		description: 'Create and manage your projects',
		routes: [
			{ name: 'Projects', icon: ListBulletIcon, link: `/${workspaceKey}/projects?page=1`, description: 'List all projects' },
			//
		],
	},
];

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
};

export const flattenedRoutes = [...apps, sideApp].reduce<Array<Route>>((acc, app) => [...acc, ...app.routes], []);
