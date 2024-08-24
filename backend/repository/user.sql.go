// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: user.sql

package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const createUser = `-- name: CreateUser :one
insert into users (id, email, password, name, provider, refresh_token, phone, avatar) 
	values ($1, $2, $3, $4, $5, $6, $7, $8) 
	returning id, deleted, created_at, name, email, phone, avatar, deactivated, provider, password, refresh_token
`

type CreateUserParams struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	Password     string    `json:"password"`
	Name         string    `json:"name"`
	Provider     string    `json:"provider"`
	RefreshToken string    `json:"refresh_token"`
	Phone        string    `json:"phone"`
	Avatar       string    `json:"avatar"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser,
		arg.ID,
		arg.Email,
		arg.Password,
		arg.Name,
		arg.Provider,
		arg.RefreshToken,
		arg.Phone,
		arg.Avatar,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Deleted,
		&i.CreatedAt,
		&i.Name,
		&i.Email,
		&i.Phone,
		&i.Avatar,
		&i.Deactivated,
		&i.Provider,
		&i.Password,
		&i.RefreshToken,
	)
	return i, err
}

const getAllUsersInWorkspaceCount = `-- name: GetAllUsersInWorkspaceCount :one
select count(users.id) from users
	inner join users_workspaces_relation 
	on users.id = users_workspaces_relation.user_id
	where users_workspaces_relation.workspace_id = $1 and users.deleted = false
`

func (q *Queries) GetAllUsersInWorkspaceCount(ctx context.Context, workspaceID uuid.UUID) (int64, error) {
	row := q.db.QueryRow(ctx, getAllUsersInWorkspaceCount, workspaceID)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
select id, deleted, created_at, name, email, phone, avatar, deactivated, provider, password, refresh_token from users where deleted = false and email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Deleted,
		&i.CreatedAt,
		&i.Name,
		&i.Email,
		&i.Phone,
		&i.Avatar,
		&i.Deactivated,
		&i.Provider,
		&i.Password,
		&i.RefreshToken,
	)
	return i, err
}

const getUserById = `-- name: GetUserById :one
select id, deleted, created_at, name, email, phone, avatar, deactivated, provider, password, refresh_token from users where deleted = false and id = $1
`

func (q *Queries) GetUserById(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRow(ctx, getUserById, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Deleted,
		&i.CreatedAt,
		&i.Name,
		&i.Email,
		&i.Phone,
		&i.Avatar,
		&i.Deactivated,
		&i.Provider,
		&i.Password,
		&i.RefreshToken,
	)
	return i, err
}

const paginateUsersInWorkspace = `-- name: PaginateUsersInWorkspace :many
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
order by users.id desc limit $2 offset $3
`

type PaginateUsersInWorkspaceParams struct {
	WorkspaceID uuid.UUID `json:"workspace_id"`
	Limit       int32     `json:"limit"`
	Offset      int32     `json:"offset"`
}

type PaginateUsersInWorkspaceRow struct {
	ID          uuid.UUID          `json:"id"`
	Name        string             `json:"name"`
	Email       string             `json:"email"`
	Phone       string             `json:"phone"`
	Avatar      string             `json:"avatar"`
	Deactivated *bool              `json:"deactivated"`
	CreatedAt   pgtype.Timestamptz `json:"created_at"`
	Provider    string             `json:"provider"`
	RoleID      pgtype.UUID        `json:"role_id"`
	RoleName    *string            `json:"role_name"`
}

func (q *Queries) PaginateUsersInWorkspace(ctx context.Context, arg PaginateUsersInWorkspaceParams) ([]PaginateUsersInWorkspaceRow, error) {
	rows, err := q.db.Query(ctx, paginateUsersInWorkspace, arg.WorkspaceID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []PaginateUsersInWorkspaceRow
	for rows.Next() {
		var i PaginateUsersInWorkspaceRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Email,
			&i.Phone,
			&i.Avatar,
			&i.Deactivated,
			&i.CreatedAt,
			&i.Provider,
			&i.RoleID,
			&i.RoleName,
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
