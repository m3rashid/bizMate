-- name: CreateForm :one
insert into forms (
	id, 
	workspace_id, 
	created_by_id, 
	title, 
	description, 
	submit_text, 
	cancel_text, 
	active, 
	is_step_form, 
	send_response_email, 
	allow_anonymous_response, 
	allow_multiple_response,
	body_ids
) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *;

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
	submit_text = $4, 
	cancel_text = $5, 
	active = $6, 
	is_step_form = $7, 
	send_response_email = $8, 
	allow_anonymous_response = $9, 
	allow_multiple_response = $10
where id = $1 returning *;


-- name: InsertNewVersionForm :one
update forms set 
	body_ids = array_prepend($2::uuid, body_ids)
where id = $1 returning *;
