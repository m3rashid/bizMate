import BriefcaseIcon from '@heroicons/react/24/outline/BriefcaseIcon';
import BuildingStorefrontIcon from '@heroicons/react/24/outline/BuildingStorefrontIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';

export type Feature = {
	title: string;
	description: string;
	icon: typeof ListBulletIcon;
	details: Omit<Feature, 'details'>[];
};

export const features: Feature[] = [
	{
		title: 'Forms',
		description: 'Create forms, take responses, view submissions and get useful insights',
		icon: ListBulletIcon,
		details: [
			{
				title: 'Form Builder',
				description: 'Create forms with various input types',
				icon: ListBulletIcon,
			},
			{
				title: 'Form Submissions',
				description: 'View form responses and export form data',
				icon: ListBulletIcon,
			},
		],
	},
	{
		title: 'Workspaces',
		description: 'Create workspaces, invite team members and collaborate',
		icon: BriefcaseIcon,
		details: [],
	},
	{
		title: 'Permissions',
		description: 'Manage roles, permissions and overall platform access controls',
		icon: BuildingStorefrontIcon,
		details: [],
	},
];
