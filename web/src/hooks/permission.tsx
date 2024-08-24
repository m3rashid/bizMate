'use client';

import { checkPermission } from './checkPermission';
import { useGetUserPermissions } from '@/api/permissions/client';

export function usePermission(userId: string) {
	const { data: permissions } = useGetUserPermissions();

	function hasPermission(objectType: string, permission: number, objectId?: string) {
		if (!permissions) return false;
		return checkPermission(permissions.data, { objectType, level: permission, objectId });
	}

	return {
		permissions,
		hasPermission,
	};
}
