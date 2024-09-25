import { workspaceKey } from '@/utils/constants';
import { PermissionObjectType } from '@/utils/types';
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import EnvelopeOpenIcon from '@heroicons/react/24/outline/EnvelopeOpenIcon';
import PresentationChartLineIcon from '@heroicons/react/24/outline/PresentationChartLineIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import { FC } from 'react';
import ShieldExclamationIcon from '@heroicons/react/24/outline/ShieldExclamationIcon';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';

export type Route = {
	name: string;
	icon: FC<any>;
	link: string;
	description: string;
	hideInSidebar: boolean;
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
				hideInSidebar: false,
				description: 'Manage all forms',
				link: `/app/${workspaceKey}/forms?page=1`,
			},
		],
	},
	{
		name: 'Calendar',
		description: "Manage your workspace's calendar",
		routes: [
			{
				name: 'Calendar',
				hideInSidebar: false,
				objectType: 'calendar_event',
				icon: PresentationChartLineIcon,
				description: 'Manage your workspace calendar',
				link: `/app/${workspaceKey}/calendar`,
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
				hideInSidebar: false,
				link: `/app/${workspaceKey}/admin?tab=users&page=1`,
				description: "Manage users' details",
			},
			{
				name: 'Roles',
				objectType: 'role',
				hideInSidebar: true,
				icon: ShieldCheckIcon,
				description: 'Manage roles and permissions',
				link: `/app/${workspaceKey}/admin?tab=roles&page=1`,
			},
			{
				hideInSidebar: true,
				icon: EnvelopeOpenIcon,
				name: 'Workspace Invitations',
				objectType: 'workspace_invite',
				description: 'Manage workspace invitations',
				link: `/app/${workspaceKey}/admin?tab=invitations`,
			},
			{
				hideInSidebar: true,
				icon: ShieldExclamationIcon,
				objectType: 'activity',
				name: 'Workspace Activity',
				description: 'View workspace activity',
				link: `/app/${workspaceKey}/admin?tab=activity`,
			},
		],
	},
];

export const sideApp: App = {
	name: 'Platform',
	description: 'About the platform',
	routes: [
		{ 
			name: 'About',
			icon: CogIcon,
			link: '/about',
			hideInSidebar: false,
			description: 'About the platform',
		},
		{ 
			name: 'Changelogs',
			icon: ArrowPathIcon,
			link: '/changelogs',
			hideInSidebar: false,
			description: "What's new on the platform",
		},
	],
};

export const flattenedRoutes = [...apps, sideApp].reduce<Array<Route>>((acc, app) => [...acc, ...app.routes], []);
