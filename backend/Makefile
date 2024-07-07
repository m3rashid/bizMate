.PHONY: up down gen new-migration migrate-up migrate-down clean

up:
	docker compose up -d

down:
	docker compose down

gen:
	sqlc generate

new-migration:
	goose -dir db/migrations create $(name) sql

migrate-up:
	goose -dir db/migrations postgres postgres://genos:genos@localhost:5432/bizmatedb?sslmode=disable up

migrate-down:
	goose -dir db/migrations postgres postgres://genos:genos@localhost:5432/bizmatedb?sslmode=disable down

clean:
	docker compose down && sudo rm -rf data tmp repository && sqlc generate
