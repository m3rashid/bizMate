-- name: CreateFormResponse :exec
insert into form_responses (
	id,
	form_id,
	workspace_id,
	created_by_id,
	device_ip,
	response
) values ($1, $2, $3, $4, $5, $6);

-- name: GetFormResponseById :one
select * from form_responses where id = $1 and workspace_id = $2 and deleted = false;

-- name: GetFormResponseByFormId :many
select * from form_responses where form_id = $1 and workspace_id = $2 and deleted = false;

-- name: PaginateFormResponses :many
select
	id,
	created_at,
	form_id,
	workspace_id,
	created_by_id,
	device_ip,
	response
from form_responses where form_id = $1 and workspace_id = $2 and deleted = false order by id desc limit $3 offset $4;

-- name: GetFormResponsesCount :one
select count(id) from form_responses where form_id = $1 and workspace_id = $2 and deleted = false;

-- name: UpdateFormResponse :exec
update form_responses set response = $2 where id = $1 and deleted = false;

-- name: DeleteFormResponse :exec
update form_responses set deleted = true where id = $1;
