-- name: CreateWorkspaceInvite :exec
insert into workspace_invites (id, workspace_id, email, created_by_id) values ($1, $2, $3, $4);

-- name: DeleteWorkspaceInvite :exec
delete from workspace_invites where id = $1;

-- name: GetInviteById :one
select * from workspace_invites where id = $1;

-- name: GetWorkspaceInviteByEmail :many
select 
	workspace_invites.id as invite_id,
	workspaces.id as workspace_id,
	workspaces.name as workspace_name,
	workspace_invites.email as email,
	workspace_invites.status as status,
	workspace_invites.created_by_id as created_by_id
from workspace_invites 
inner join workspaces on workspace_invites.workspace_id = workspaces.id 
where email = $1;
