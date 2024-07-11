-- name: CreateForm :one
insert into forms (
	id,
	workspace_id,
	created_by_id,
	title,
	description,
	active,
	send_response_email,
	allow_anonymous_response,
	allow_multiple_response,
	form_body_id
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *;

-- name: GetFormById :one
select * from forms where id = $1 and workspace_id = $2;

-- name: PaginateForms :many
select * from forms where workspace_id = $1 order by id desc limit $2 offset $3;

-- name: GetFormsCount :one
select count(id) from forms where workspace_id = $1;

-- name: UpdateForm :one
update forms set
	title = $2,
	description = $3,
	active = $4,
	send_response_email = $5,
	allow_anonymous_response = $6,
	allow_multiple_response = $7
where id = $1 returning *;
