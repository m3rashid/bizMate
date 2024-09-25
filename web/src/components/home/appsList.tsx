import { workspaceKey } from '@/utils/constants';
import { PermissionObjectType } from '@/utils/types';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import CogIcon from '@heroicons/react/24/outline/CogIcon';
import EnvelopeOpenIcon from '@heroicons/react/24/outline/EnvelopeOpenIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import PresentationChartLineIcon from '@heroicons/react/24/outline/PresentationChartLineIcon';
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import ShieldExclamationIcon from '@heroicons/react/24/outline/ShieldExclamationIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import { FC } from 'react';

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
		name: 'Human Resources',
		description: "Manage your workspace's HR",
		routes: [
			{
				name: 'Users',
				icon: UsersIcon,
				objectType: 'user',
				hideInSidebar: false,
				link: `/app/${workspaceKey}/hr?tab=users&page=1`,
				description: "Manage users' details",
			},
			{
				name: 'Roles',
				objectType: 'role',
				hideInSidebar: false,
				icon: ShieldCheckIcon,
				description: 'Manage roles and permissions',
				link: `/app/${workspaceKey}/hr?tab=roles&page=1`,
			},
			{
				hideInSidebar: false,
				icon: EnvelopeOpenIcon,
				name: 'Workspace Invitations',
				objectType: 'workspace_invite',
				description: 'Manage workspace invitations',
				link: `/app/${workspaceKey}/hr?tab=invitations`,
			},
		],
	},
	{
		name: 'Admin',
		description: 'Admin controls for the workspace',
		routes: [
			{
				hideInSidebar: false,
				icon: ShieldExclamationIcon,
				objectType: 'activity',
				name: 'Workspace Activity',
				description: 'View workspace activity',
				link: `/app/${workspaceKey}/admin?tab=activity`,
			},
			{
				name: 'Workspace Settings',
				icon: CogIcon,
				objectType: 'workspace',
				hideInSidebar: false,
				link: `/app/${workspaceKey}/admin?tab=settings`,
				description: "Manage your workspace's settings",
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
