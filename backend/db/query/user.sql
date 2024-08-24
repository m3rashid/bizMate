-- name: GetUserById :one
select * from users where deleted = false and id = $1;

-- name: GetUserByEmail :one
select * from users where deleted = false and email = $1;

-- name: CreateUser :one
insert into users (id, email, password, name, provider, refresh_token, phone, avatar) 
	values ($1, $2, $3, $4, $5, $6, $7, $8) 
	returning *;

-- name: PaginateUsersInWorkspace :many
select 
	users.id,
	users.name,
	users.email,
	users.phone,
	users.avatar,
	users.deactivated,
	users.created_at,
	users.provider,
	roles.id as role_id,
	roles.name as role_name
from users
inner join users_workspaces_relation 
	on users.id = users_workspaces_relation.user_id
full outer join roles_users_relation
	on users.id = roles_users_relation.user_id
full outer join roles
	on roles.id = roles_users_relation.role_id
where users_workspaces_relation.workspace_id = $1 and users.deleted = false
order by users.id desc limit $2 offset $3;

-- name: GetAllUsersInWorkspaceCount :one
select count(users.id) from users
	inner join users_workspaces_relation 
	on users.id = users_workspaces_relation.user_id
	where users_workspaces_relation.workspace_id = $1 and users.deleted = false;
