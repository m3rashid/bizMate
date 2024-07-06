-- name: GetUserById :one
select * from users where deleted = false and id = $1;

-- name: GetUserByEmail :one
select * from users where deleted = false and email = $1;

-- name: CreateUser :one
insert into users (id, email, password, name, provider, refresh_token, phone, avatar) 
	values ($1, $2, $3, $4, $5, $6, $7, $8) 
	returning *;
