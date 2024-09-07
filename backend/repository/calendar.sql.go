// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: calendar.sql

package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const createCalendarEvent = `-- name: CreateCalendarEvent :exec
insert into calendar_event (
	workspace_id,
	id,
	name,
	description,
	start_time,
	end_time,
	is_private,
	recurrence_rule,
	created_by_id
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`

type CreateCalendarEventParams struct {
	WorkspaceID    uuid.UUID          `json:"workspace_id"`
	ID             uuid.UUID          `json:"id"`
	Name           string             `json:"name"`
	Description    *string            `json:"description"`
	StartTime      pgtype.Timestamptz `json:"start_time"`
	EndTime        pgtype.Timestamptz `json:"end_time"`
	IsPrivate      *bool              `json:"is_private"`
	RecurrenceRule *string            `json:"recurrence_rule"`
	CreatedByID    uuid.UUID          `json:"created_by_id"`
}

func (q *Queries) CreateCalendarEvent(ctx context.Context, arg CreateCalendarEventParams) error {
	_, err := q.db.Exec(ctx, createCalendarEvent,
		arg.WorkspaceID,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.StartTime,
		arg.EndTime,
		arg.IsPrivate,
		arg.RecurrenceRule,
		arg.CreatedByID,
	)
	return err
}

const getCalendarEventById = `-- name: GetCalendarEventById :one
select id, deleted, created_at, updated_at, name, is_private, start_time, end_time, recurrence_rule, description, created_by_id, workspace_id from calendar_event where id = $1 and deleted = false
`

func (q *Queries) GetCalendarEventById(ctx context.Context, id uuid.UUID) (CalendarEvent, error) {
	row := q.db.QueryRow(ctx, getCalendarEventById, id)
	var i CalendarEvent
	err := row.Scan(
		&i.ID,
		&i.Deleted,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
		&i.IsPrivate,
		&i.StartTime,
		&i.EndTime,
		&i.RecurrenceRule,
		&i.Description,
		&i.CreatedByID,
		&i.WorkspaceID,
	)
	return i, err
}

const getCalendarEventsInRangeByWorkspace = `-- name: GetCalendarEventsInRangeByWorkspace :many
SELECT ce.id, ce.deleted, ce.created_at, ce.updated_at, ce.name, ce.is_private, ce.start_time, ce.end_time, ce.recurrence_rule, ce.description, ce.created_by_id, ce.workspace_id
FROM calendar_event ce
JOIN calendar_event_participants cep
  ON ce.id = cep.event_id
WHERE ce.deleted = false
  AND ce.is_private = false OR $3::bool = true
  AND ce.workspace_id = $1
  AND cep.user_id = $2 -- Current user ID
	AND ce.start_time >= $4::TIMESTAMP WITH TIME ZONE -- yyyy-mm-dd format
  AND ce.start_time <= $5::TIMESTAMP WITH TIME ZONE -- yyyy-mm-dd format
  AND ce.end_time >= $4::TIMESTAMP WITH TIME ZONE
  AND ce.end_time <= $5::TIMESTAMP WITH TIME ZONE
`

type GetCalendarEventsInRangeByWorkspaceParams struct {
	WorkspaceID uuid.UUID          `json:"workspace_id"`
	UserID      uuid.UUID          `json:"user_id"`
	IsPrivate   bool               `json:"is_private"`
	StartTime   pgtype.Timestamptz `json:"start_time"`
	EndTime     pgtype.Timestamptz `json:"end_time"`
}

func (q *Queries) GetCalendarEventsInRangeByWorkspace(ctx context.Context, arg GetCalendarEventsInRangeByWorkspaceParams) ([]CalendarEvent, error) {
	rows, err := q.db.Query(ctx, getCalendarEventsInRangeByWorkspace,
		arg.WorkspaceID,
		arg.UserID,
		arg.IsPrivate,
		arg.StartTime,
		arg.EndTime,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []CalendarEvent
	for rows.Next() {
		var i CalendarEvent
		if err := rows.Scan(
			&i.ID,
			&i.Deleted,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Name,
			&i.IsPrivate,
			&i.StartTime,
			&i.EndTime,
			&i.RecurrenceRule,
			&i.Description,
			&i.CreatedByID,
			&i.WorkspaceID,
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
