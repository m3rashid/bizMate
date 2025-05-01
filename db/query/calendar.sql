-- name: CreateCalendarEvent :exec
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
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9);

-- name: GetCalendarEventById :one
select * from calendar_event where id = $1 and deleted = false;

-- name: GetCalendarEventsInRangeByWorkspace :many
SELECT ce.*
FROM calendar_event ce
JOIN calendar_event_participants cep
  ON ce.id = cep.event_id
WHERE ce.deleted = false
  AND ce.is_private = false OR sqlc.arg(is_private)::bool = true
  AND ce.workspace_id = $1
  AND cep.user_id = $2 -- Current user ID
	AND ce.start_time >= sqlc.arg(start_time)::TIMESTAMP WITH TIME ZONE -- yyyy-mm-dd format
  AND ce.start_time <= sqlc.arg(end_time)::TIMESTAMP WITH TIME ZONE -- yyyy-mm-dd format
  AND ce.end_time >= sqlc.arg(start_time)::TIMESTAMP WITH TIME ZONE
  AND ce.end_time <= sqlc.arg(end_time)::TIMESTAMP WITH TIME ZONE;
