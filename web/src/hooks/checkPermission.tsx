export type Permission = {
	id: string;
	object_type: string;
	object_id: string;
	user_id: string;
	level: number;
};

export function checkPermission(
	permissions: Permission[],
	checkFor: {
		objectType: string;
		level: number;
		objectId?: string;
	}
) {
	if (!permissions || permissions.length === 0) return false;
	return permissions.some(
		(permission) =>
			permission.object_type === checkFor.objectType &&
			permission.level === checkFor.level &&
			(!checkFor.objectId || permission.object_id === checkFor.objectId)
	);
}
