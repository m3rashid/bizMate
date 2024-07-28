import { UnionOfObject } from './types';

export const pages = {
	home: '/',
	about: '/about',
	login: '/auth/login',
	changelogs: '/changelogs',
	register: '/auth/register',
	chooseWorkspace: '/auth/choose-workspace',
} as const;

export function workspacePages(workspaceId: string) {
	//
}

export const exportableTables = ['form_response_table', 'user_table', 'forms_table', 'dashboard_table', 'contacts_table'] as const;
