-- name: GetUserById :one
select * from users where deleted = false and id = $1;

-- name: GetUserByEmail :one
select * from users where deleted = false and email = $1;

-- name: CreateUser :one
insert into users (email, password, name, provider, phone, refresh_token) 
	values ($1, $2, $3, $4, $5, $6) 
	returning *;
