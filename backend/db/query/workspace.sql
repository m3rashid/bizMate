-- name: GetCurrentUserWorkspaces :many
select * from workspaces 
	where deleted = false and 
	id in (
		select workspace_id from users_workspaces_relation 
		where user_id = $1 and deleted = false
	);

-- name: CreateWorkspace :one
insert into workspaces (
	id,
	name,
	color,
	description,
	created_by_id
) values ($1, $2, $3, $4, $5) returning *;

-- name: AddUserToWorkspace :exec
insert into users_workspaces_relation (
	user_id,
	workspace_id,
	deleted
) values ($1, $2, false)
on conflict (user_id, workspace_id) do update set deleted = false;

-- name: RemoveUserFromWorkspace :exec
update users_workspaces_relation 
	set deleted = true 
	where user_id = $1 and workspace_id = $2;

-- name: GetWorkspaceById :one
select * from workspaces where id = $1 and deleted = false;
