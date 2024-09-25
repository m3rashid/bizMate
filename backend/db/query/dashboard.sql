-- name: CountFormsInWorkspace :many
select count(id), active from forms where workspace_id = $1 and deleted = false group by active;

-- name: CountUsersInWorkspace :one
select count(user_id) from users_workspaces_relation where workspace_id = $1 and deleted = false;
