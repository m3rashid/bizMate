-- name: GetUserBarePermissions :many
select * from bare_permissions where user_id = $1 and workspace_id = $2;

-- name: AddBarePermissionTouser :exec
insert into bare_permissions (
	user_id,
	workspace_id,
	permission
) values ($1, $2, $3);

-- name: RemoveBarePermissionFromUser :exec
delete from bare_permissions where user_id = $1 and workspace_id = $2 and permission = $3;
