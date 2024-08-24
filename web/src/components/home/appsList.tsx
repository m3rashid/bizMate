import { workspaceKey } from '@/utils/constants';
import { BriefcaseIcon, UsersIcon } from '@heroicons/react/24/outline';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
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
		name: 'HR',
		description: "Manage your users' data, roles and permissions",
		routes: [
			{ name: 'Users', icon: UsersIcon, link: `/${workspaceKey}/hr?tab=users&page=1`, description: 'Manage users' },
			{ name: 'Roles', icon: BriefcaseIcon, link: `/${workspaceKey}/hr?tab=roles&page=1`, description: 'Manage roles' },
		],
	},
	{
		name: 'You',
		description: 'Manage your account',
		routes: [
			{ name: 'Settings', icon: CogIcon, link: `/${workspaceKey}/settings`, description: 'Manage your account settings' },
			{ name: 'Profile', icon: UserIcon, link: `/${workspaceKey}/profile`, description: 'Manage your profile' },
			//
		],
	},
];

export const sideApp: App = {
	name: 'Platform',
	description: 'About the platform',
	routes: [
		{ name: 'About', description: 'About the platform', icon: CogIcon, link: '/about' },
		{ name: 'Changelogs', description: "What's new on the platform", icon: CogIcon, link: '/changelogs' },
	],
};

export const flattenedRoutes = [...apps, sideApp].reduce<Array<Route>>((acc, app) => [...acc, ...app.routes], []);
