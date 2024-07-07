// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: workspace.sql

package repository

import (
	"context"

	"github.com/google/uuid"
)

const addUserToWorkspace = `-- name: AddUserToWorkspace :exec
insert into users_workspaces_relation (user_id, workspace_id) 
	values ($1, $2)
`

type AddUserToWorkspaceParams struct {
	UserID      uuid.UUID `json:"user_id"`
	WorkspaceID uuid.UUID `json:"workspace_id"`
}

func (q *Queries) AddUserToWorkspace(ctx context.Context, arg AddUserToWorkspaceParams) error {
	_, err := q.db.Exec(ctx, addUserToWorkspace, arg.UserID, arg.WorkspaceID)
	return err
}

const createWorkspace = `-- name: CreateWorkspace :one
insert into workspaces (id, name, description, created_by_id)
	values ($1, $2, $3, $4) returning id, name, description, deleted, created_at, created_by_id
`

type CreateWorkspaceParams struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	CreatedByID uuid.UUID `json:"created_by_id"`
}

func (q *Queries) CreateWorkspace(ctx context.Context, arg CreateWorkspaceParams) (Workspace, error) {
	row := q.db.QueryRow(ctx, createWorkspace,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.CreatedByID,
	)
	var i Workspace
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Deleted,
		&i.CreatedAt,
		&i.CreatedByID,
	)
	return i, err
}

const getCurrentUserWorkspaces = `-- name: GetCurrentUserWorkspaces :many
select id, name, description, deleted, created_at, created_by_id from workspaces 
	where deleted = false and 
	id in (select workspace_id from users_workspaces_relation where user_id = $1)
`

func (q *Queries) GetCurrentUserWorkspaces(ctx context.Context, userID uuid.UUID) ([]Workspace, error) {
	rows, err := q.db.Query(ctx, getCurrentUserWorkspaces, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Workspace
	for rows.Next() {
		var i Workspace
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Deleted,
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

const getWorkspaceById = `-- name: GetWorkspaceById :one
select id, name, description, deleted, created_at, created_by_id from workspaces where id = $1 and deleted = false
`

func (q *Queries) GetWorkspaceById(ctx context.Context, id uuid.UUID) (Workspace, error) {
	row := q.db.QueryRow(ctx, getWorkspaceById, id)
	var i Workspace
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Deleted,
		&i.CreatedAt,
		&i.CreatedByID,
	)
	return i, err
}
