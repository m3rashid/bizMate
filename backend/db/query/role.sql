-- name: CreateRole :exec
insert into roles (
	name,
	description,
	permissions,
	workspace_id,
	created_by_id
) values ($1, $2, $3, $4, $5);

-- name: GetRoleById :one
select * from roles where id = $1 and workspace_id = $2;

-- name: GetRolesByWorkspaceId :many
select * from roles where workspace_id = $1;

-- name: UpdateRole :exec
update roles set
	name = $2,
	description = $3,
	permissions = $4
where id = $1 and workspace_id = $5;

-- name: DeleteRole :exec
delete from roles where id = $1 and workspace_id = $2;

-- name: AddUserToRole :exec
insert into roles_users_relation (
	role_id,
	user_id,
	workspace_id
) values ($1, $2, $3);

-- name: RemoveUserFromRole :exec
delete from roles_users_relation where role_id = $1 and user_id = $2 and workspace_id = $3;

-- name: GetRoleUsers :many
select * from roles_users_relation where role_id = $1 and workspace_id = $2;

-- name: GetRolesByUserId :many
select * from roles where id in (select role_id from roles_users_relation r where r.user_id = $1 and r.workspace_id = $2);
