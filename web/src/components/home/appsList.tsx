import { workspaceKey } from '@/utils/constants';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import HandRaisedIcon from '@heroicons/react/24/outline/HandRaisedIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import PresentationChartLineIcon from '@heroicons/react/24/outline/PresentationChartLineIcon';
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
		name: 'Admin',
		description: "Manage your workspace's settings",
		routes: [
			{ name: 'Users', icon: UsersIcon, link: `/${workspaceKey}/admin?tab=users&page=1`, description: "Manage users' details" },
			{ name: 'Roles', icon: HandRaisedIcon, link: `/${workspaceKey}/admin?tab=roles&page=1`, description: 'Manage roles and permissions' },
			{
				name: 'Workspace Invitations',
				icon: PresentationChartLineIcon,
				description: 'Manage invites to workspace',
				link: `/${workspaceKey}/admin?tab=invitations&page=1`,
			},
			{ name: 'Activity', icon: PresentationChartLineIcon, link: `/${workspaceKey}/admin?tab=activity&page=1`, description: 'Manage roles' },
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
