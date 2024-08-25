'use client';

import { checkPermission } from './checkPermission';
import { useGetUserPermissions } from '@/api/permissions/client';
import { PermissionLevel, PermissionObjectType } from '@/utils/types';

export function usePermission() {
	const { data: permissions } = useGetUserPermissions();

	function hasPermission(object_type: PermissionObjectType, level: PermissionLevel, object_id?: string) {
		if (!permissions) return false;
		return checkPermission(permissions.data, { object_type, level, object_id });
	}

	return {
		permissions,
		hasPermission,
	};
}
