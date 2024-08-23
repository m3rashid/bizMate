export type Permission = {
	object_type: string;
	object_id: string;
	user_id: string;
	permission: number;
};

export function checkPermission(
	permissions: Permission[],
	checkFor: {
		objectType: string;
		permission: number;
		objectId?: string;
	}
) {
	if (!permissions || permissions.length === 0) return false;
	return permissions.some(
		(permission) =>
			permission.object_type === checkFor.objectType &&
			permission.permission === checkFor.permission &&
			(!checkFor.objectId || permission.object_id === checkFor.objectId)
	);
}
