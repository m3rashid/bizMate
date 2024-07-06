-- name: GetCurrentUserWorkspaces :many
select * from workspaces 
	where deleted = false and 
	id in (select workspace_id from users_workspaces_relation where user_id = $1);

-- name: CreateWorkspace :one
insert into workspaces (name, description, created_by_id)
	values ($1, $2, $3) returning id;

-- name: AddUserToWorkspace :one 
insert into users_workspaces_relation (user_id, workspace_id) 
	values ($1, $2) returning *;

-- name: GetWorkspaceById :one
select * from workspaces where id = $1 and deleted = false;
