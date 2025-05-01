include $(PWD)/.env.local

.PHONY: up down gen new-migration migrate-up migrate-down clean build

up:
	docker compose up -d

down:
	docker compose down

gen:
	sqlc generate

new-migration:
	goose -dir db/migrations create $(name) sql

migrate-up:
	goose -dir db/migrations postgres $(POSTGRES_URI) up

migrate-down:
	goose -dir db/migrations postgres $(POSTGRES_URI) down

clean:
	docker compose down && sudo rm -rf data tmp repository && sqlc generate

build:
	(rm -rf bin/backend || true) && go build -o bin/backend .
