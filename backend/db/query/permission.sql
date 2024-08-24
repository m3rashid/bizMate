-- name: GetUserBarePermissions :many
select * from bare_permissions where user_id = $1 and workspace_id = $2;

-- name: AddBarePermissionToUser :exec
insert into bare_permissions (
	id,
	user_id,
	workspace_id,
	object_type,
	object_id,
	level
) values ($1, $2, $3, $4, $5, $6);

-- name: RemoveBarePermissionFromUser :exec
delete from bare_permissions where user_id = $1 and workspace_id = $2 and level = $3 and object_type = $4 and object_id = $5;
