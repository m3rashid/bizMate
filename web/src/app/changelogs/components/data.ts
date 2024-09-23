export type ChangeLog = {
	id: string | number;
	date: string;
	tldr: string;
	changes: string[];
};

export const changelogs: ChangeLog[] = [
	{
		id: 5,
		date: 'Sep 23, 2024',
		tldr: "We're live! and open-source",
		changes: ["Open-source the app's codebase, checkout on github at m3rashid/bizMate", "We're live! 🚀 featured on producthunt"],
	},
	{
		id: 4,
		date: 'Aug 25, 2024',
		tldr: 'Roles, permissions and access controls',
		changes: [
			'Add roles and permissions to the app 🛡️',
			'Admin can watch all workspace activities',
			'Admin can manage workspace members, workspace invites',
		],
	},
	{
		id: 3,
		date: 'Aug 21, 2024',
		tldr: 'Form updates and improvements',
		changes: ['Feedback on form response submission', 'Create workspaces instant feedback'],
	},
	{
		id: 2,
		date: 'June 8, 2024',
		tldr: 'Initial release: Forms and submissions',
		changes: [
			'Create form builder and submission system',
			'View form responses, form analytics, and export form data',
			'Form components include input, radio, select, phone number, text-area, rich-text, switch-toggle',
			'Form analytics include pie and graph charts',
		],
	},
	{
		id: 1,
		date: 'May 2, 2024',
		tldr: 'Project started',
		changes: ['Add authentication and authorization to the app', 'Add workspaces support for users'],
	},
];
