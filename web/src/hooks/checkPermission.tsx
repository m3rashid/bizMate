import { PERMISSION_ADMIN } from '@/utils/constants';
import { RolePermission } from '@/utils/types';

export function checkPermission(permissions: RolePermission[], checkFor: Omit<RolePermission, 'user_id'>) {
	if (!permissions || permissions.length === 0) return false;
	for (let i = 0; i < permissions.length; i++) {
		if (permissions[i].object_type === 'workspace' && permissions[i].level === PERMISSION_ADMIN) return true;
		if (permissions[i].object_type === checkFor.object_type && (permissions[i].level & checkFor.level) === 0) return true;
	}
	return false;
}
