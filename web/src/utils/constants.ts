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
	'activity',
] as const;

export const PERMISSION_NONE = 1;
export const PERMISSION_READ = 2;
export const PERMISSION_CREATE = 4;
export const PERMISSION_UPDATE = 8;
export const PERMISSION_DELETE = 16;
export const PERMISSION_EXPORT = 32;
export const PERMISSION_ADMIN = 64;

export const permissionLevelNumbers = [
	PERMISSION_NONE,
	PERMISSION_READ,
	PERMISSION_CREATE,
	PERMISSION_UPDATE,
	PERMISSION_DELETE,
	PERMISSION_EXPORT,
	PERMISSION_ADMIN,
] as const;

export const permissionLevelNumberToStringMap = {
	[PERMISSION_NONE]: 'none',
	[PERMISSION_READ]: 'read',
	[PERMISSION_CREATE]: 'create',
	[PERMISSION_UPDATE]: 'update',
	[PERMISSION_DELETE]: 'delete',
	[PERMISSION_EXPORT]: 'export',
	[PERMISSION_ADMIN]: 'admin',
} as const;

export const permissionLevelStringToNumberMap = {
	none: PERMISSION_NONE,
	read: PERMISSION_READ,
	create: PERMISSION_CREATE,
	update: PERMISSION_UPDATE,
	delete: PERMISSION_DELETE,
	export: PERMISSION_EXPORT,
	admin: PERMISSION_ADMIN,
} as const;

export const nilUuid = '00000000-0000-0000-0000-000000000000';
