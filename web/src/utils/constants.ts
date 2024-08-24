export const workspaceKey = '__wid__';

export const exportableTables = ['form_response_table', 'user_table', 'forms_table', 'dashboard_table', 'contacts_table'] as const;

export const permissionObjectTypes = [
	'user',
	'workspace',
	'workspace_invite',
	'form',
	'form_responses',
	'form_analysis',
	'permission',
	'role',
] as const;

export const permissionLevelNumbers = [1, 2, 4, 6, 16, 32, 64] as const;

export const permissionLevelNumberToStringMap = {
	1: 'none',
	2: 'read',
	4: 'create',
	6: 'update',
	16: 'delete',
	32: 'export',
	64: 'admin',
} as const;

export const permissionLevelStringToNumberMap = {
	none: 1,
	read: 2,
	create: 4,
	update: 6,
	delete: 16,
	export: 32,
	admin: 64,
} as const;
