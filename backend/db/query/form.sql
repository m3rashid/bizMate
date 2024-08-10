-- name: CreateForm :exec
insert into forms (
	id,
	workspace_id,
	created_by_id,
	title,
	description,
	active,
	send_response_email,
	allow_anonymous_responses,
	allow_multiple_responses,
	submit_text,
	cancel_text
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);

-- name: GetFormById :one
select * from forms where id = $1 and workspace_id = $2 and deleted = false;

-- name: PaginateForms :many
select
	id,
	created_at,
	workspace_id,
	created_by_id,
	title,
	active,
	description,
	send_response_email,
	allow_anonymous_responses,
	allow_multiple_responses,
	submit_text,
	cancel_text
from forms where workspace_id = $1 and deleted = false order by id desc limit $2 offset $3;

-- name: GetFormsCount :one
select count(id) from forms where workspace_id = $1 and deleted = false;

-- name: UpdateForm :exec
update forms set
	title = $2,
	description = $3,
	active = $4,
	send_response_email = $5,
	allow_anonymous_responses = $6,
	allow_multiple_responses = $7,
	submit_text = $8,
	cancel_text = $9
where id = $1 and deleted = false;

-- name: UpdateFormBody :exec
update forms set form_body = $2 where id = $1 and deleted = false;

-- name: DeleteForm :exec
update forms set deleted = true where id = $1;
