-- name: AcceptInvite :one
update user_invites set accepted = true where id = $1 returning *;

-- name: GetUserInviteByEmail :one
select * from user_invites where email = $1 and workspace_id = $2 and accepted = false;
