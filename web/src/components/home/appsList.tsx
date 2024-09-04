import { workspaceKey } from '@/utils/constants';
import { PermissionObjectType } from '@/utils/types';
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
	objectType?: PermissionObjectType;
};

export type App = {
	name: string;
	routes: Route[];
	description: string;
};

export const apps: App[] = [
	{
		name: 'Forms',
		description: 'Create, publish, and get analytics for your forms',
		routes: [
			{
				name: 'Forms',
				objectType: 'form',
				icon: ListBulletIcon,
				description: 'Manage all forms',
				link: `/app/${workspaceKey}/forms?page=1`,
			},
		],
	},
	{
		name: 'Admin',
		description: "Manage your workspace's settings",
		routes: [
			{
				name: 'Users',
				icon: UsersIcon,
				objectType: 'user',
				link: `/app/${workspaceKey}/admin?tab=users&page=1`,
				description: "Manage users' details",
			},
			{
				name: 'Roles',
				objectType: 'role',
				icon: HandRaisedIcon,
				description: 'Manage roles and permissions',
				link: `/app/${workspaceKey}/admin?tab=roles&page=1`,
			},
			{
				name: 'Workspace Invitations',
				objectType: 'workspace_invite',
				icon: PresentationChartLineIcon,
				description: 'Manage invites to workspace',
				link: `/app/${workspaceKey}/admin?tab=invitations&page=1`,
			},
			{
				name: 'Activity',
				objectType: 'activity',
				description: 'Manage roles',
				icon: PresentationChartLineIcon,
				link: `/app/${workspaceKey}/admin?tab=activity&page=1`,
			},
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
