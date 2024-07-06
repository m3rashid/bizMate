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
	true

migrate-down:
	true

clean:
	docker compose down && sudo rm -rf data tmp repository && sqlc generate
