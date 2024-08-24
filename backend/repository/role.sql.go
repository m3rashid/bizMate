// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: role.sql

package repository

import (
	"context"

	"github.com/google/uuid"
)

const addUserToRole = `-- name: AddUserToRole :exec
insert into roles_users_relation (
	role_id,
	user_id,
	workspace_id
) values ($1, $2, $3)
`

type AddUserToRoleParams struct {
	RoleID      uuid.UUID `json:"role_id"`
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) AddUserToRole(ctx context.Context, arg AddUserToRoleParams) error {
	_, err := q.db.Exec(ctx, addUserToRole, arg.RoleID, arg.UserID, arg.WorkspaceID)
	return err
}

const createRole = `-- name: CreateRole :exec
insert into roles (
	id,
	name,
	description,
	permissions,
	workspace_id,
	created_by_id
) values ($1, $2, $3, $4, $5, $6)
`

type CreateRoleParams struct {
	ID          uuid.UUID       `json:"id"`
	Name        string          `json:"name"`
	Description *string         `json:"description"`
	Permissions RolePermissions `json:"permissions"`
	WorkspaceID uuid.UUID       `json:"workspace_id"`
	CreatedByID uuid.UUID       `json:"created_by_id"`
}

func (q *Queries) CreateRole(ctx context.Context, arg CreateRoleParams) error {
	_, err := q.db.Exec(ctx, createRole,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.Permissions,
		arg.WorkspaceID,
		arg.CreatedByID,
	)
	return err
}

const deleteRole = `-- name: DeleteRole :exec
delete from roles where id = $1 and workspace_id = $2
`

type DeleteRoleParams struct {
	ID          uuid.UUID `json:"id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) DeleteRole(ctx context.Context, arg DeleteRoleParams) error {
	_, err := q.db.Exec(ctx, deleteRole, arg.ID, arg.WorkspaceID)
	return err
}

const getRoleById = `-- name: GetRoleById :one
select id, name, description, permissions, workspace_id, created_at, created_by_id from roles where id = $1 and workspace_id = $2
`

type GetRoleByIdParams struct {
	ID          uuid.UUID `json:"id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) GetRoleById(ctx context.Context, arg GetRoleByIdParams) (Role, error) {
	row := q.db.QueryRow(ctx, getRoleById, arg.ID, arg.WorkspaceID)
	var i Role
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Permissions,
		&i.WorkspaceID,
		&i.CreatedAt,
		&i.CreatedByID,
	)
	return i, err
}

const getRoleUsers = `-- name: GetRoleUsers :many
select role_id, user_id, workspace_id from roles_users_relation where role_id = $1 and workspace_id = $2
`

type GetRoleUsersParams struct {
	RoleID      uuid.UUID `json:"role_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) GetRoleUsers(ctx context.Context, arg GetRoleUsersParams) ([]RolesUsersRelation, error) {
	rows, err := q.db.Query(ctx, getRoleUsers, arg.RoleID, arg.WorkspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []RolesUsersRelation
	for rows.Next() {
		var i RolesUsersRelation
		if err := rows.Scan(&i.RoleID, &i.UserID, &i.WorkspaceID); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getRolesByUserId = `-- name: GetRolesByUserId :many
select id, name, description, permissions, workspace_id, created_at, created_by_id from roles where id in (select role_id from roles_users_relation r where r.user_id = $1 and r.workspace_id = $2)
`

type GetRolesByUserIdParams struct {
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) GetRolesByUserId(ctx context.Context, arg GetRolesByUserIdParams) ([]Role, error) {
	rows, err := q.db.Query(ctx, getRolesByUserId, arg.UserID, arg.WorkspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Role
	for rows.Next() {
		var i Role
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Permissions,
			&i.WorkspaceID,
			&i.CreatedAt,
			&i.CreatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getRolesByWorkspaceIdCount = `-- name: GetRolesByWorkspaceIdCount :one
select count(id) from roles where workspace_id = $1
`

func (q *Queries) GetRolesByWorkspaceIdCount(ctx context.Context, workspaceID uuid.UUID) (int64, error) {
	row := q.db.QueryRow(ctx, getRolesByWorkspaceIdCount, workspaceID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const paginateRolesByWorkspaceId = `-- name: PaginateRolesByWorkspaceId :many
select id, name, description, permissions, workspace_id, created_at, created_by_id from roles where workspace_id = $1 order by id desc limit $2 offset $3
`

type PaginateRolesByWorkspaceIdParams struct {
	WorkspaceID uuid.UUID `json:"workspace_id"`
	Limit       int32     `json:"limit"`
	Offset      int32     `json:"offset"`
}

func (q *Queries) PaginateRolesByWorkspaceId(ctx context.Context, arg PaginateRolesByWorkspaceIdParams) ([]Role, error) {
	rows, err := q.db.Query(ctx, paginateRolesByWorkspaceId, arg.WorkspaceID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Role
	for rows.Next() {
		var i Role
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Permissions,
			&i.WorkspaceID,
			&i.CreatedAt,
			&i.CreatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const removeUserFromRole = `-- name: RemoveUserFromRole :exec
delete from roles_users_relation where role_id = $1 and user_id = $2 and workspace_id = $3
`

type RemoveUserFromRoleParams struct {
	RoleID      uuid.UUID `json:"role_id"`
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) RemoveUserFromRole(ctx context.Context, arg RemoveUserFromRoleParams) error {
	_, err := q.db.Exec(ctx, removeUserFromRole, arg.RoleID, arg.UserID, arg.WorkspaceID)
	return err
}

const updateRole = `-- name: UpdateRole :exec
update roles set
	name = $2,
	description = $3,
	permissions = $4
where id = $1 and workspace_id = $5
`

type UpdateRoleParams struct {
	ID          uuid.UUID       `json:"id"`
	Name        string          `json:"name"`
	Description *string         `json:"description"`
	Permissions RolePermissions `json:"permissions"`
	WorkspaceID uuid.UUID       `json:"workspace_id"`
}

func (q *Queries) UpdateRole(ctx context.Context, arg UpdateRoleParams) error {
	_, err := q.db.Exec(ctx, updateRole,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.Permissions,
		arg.WorkspaceID,
	)
	return err
}
