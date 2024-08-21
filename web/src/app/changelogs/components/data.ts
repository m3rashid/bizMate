export type ChangeLog = {
	id: string | number;
	date: string;
	tldr: string;
	changes: string[];
};

export const changelogs: ChangeLog[] = [
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
